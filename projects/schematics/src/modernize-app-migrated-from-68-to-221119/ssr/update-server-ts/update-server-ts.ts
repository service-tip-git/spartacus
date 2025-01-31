/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { removeImportsFromServerTs } from './remove-imports-from-server-ts';
import { addImportsToServerTs } from './add-imports-to-server-ts';
import { findNodes } from '@schematics/angular/utility/ast-utils';
import { parseTsFileContent } from '../../../shared/utils/file-utils';

interface ReplaceVariableDeclarationParams {
  fileContent: string;
  variableName: string;
  newDeclaration: string;
}

function replaceVariableDeclaration({
  fileContent,
  variableName,
  newDeclaration,
}: ReplaceVariableDeclarationParams): string {
  const sourceFile = parseTsFileContent(fileContent);

  // Find all variable declarations
  const nodes = findNodes(sourceFile, ts.SyntaxKind.VariableDeclaration);

  // Find the specific variable declaration we want to replace
  const targetNode = nodes.find((node) => {
    if (!ts.isVariableDeclaration(node)) return false;
    const name = node.name;
    return ts.isIdentifier(name) && name.text === variableName;
  });

  if (!targetNode) {
    return fileContent;
  }

  // Get the parent VariableStatement to include the 'const' keyword
  const statement = targetNode.parent.parent;
  const start = statement.getStart();
  const end = statement.getEnd();

  // Replace the entire statement
  return fileContent.slice(0, start) + newDeclaration + fileContent.slice(end);
}

interface ReplaceMethodCallArgumentParams {
  fileContent: string;
  objectName: string;
  methodName: string;
  argument: {
    position: number;
    old: string;
    new: string;
  };
}

function replaceMethodCallArgument({
  fileContent,
  objectName,
  methodName,
  argument,
}: ReplaceMethodCallArgumentParams): string {
  const sourceFile = parseTsFileContent(fileContent);

  const nodes = findNodes(
    sourceFile,
    ts.SyntaxKind.CallExpression,
    undefined,
    true
  );

  // Find all matching method calls
  const targetNodes = nodes.filter((node) => {
    if (!ts.isCallExpression(node)) return false;
    const expression = node.expression;
    if (!ts.isPropertyAccessExpression(expression)) return false;

    const object = expression.expression;
    const method = expression.name;

    if (!ts.isIdentifier(object) || !ts.isIdentifier(method)) return false;

    // Check if this is the method call we're looking for
    const isTargetMethod =
      object.text === objectName && method.text === methodName;
    if (!isTargetMethod) return false;

    const arg = node.arguments[argument.position];
    return ts.isIdentifier(arg) && arg.text === argument.old;
  });

  if (!targetNodes.length) {
    return fileContent;
  }

  // Process all matches
  return targetNodes.reduce((content, targetNode) => {
    if (!ts.isCallExpression(targetNode)) return content;

    // Find the argument to replace
    let argToReplace: ts.Node | undefined;
    argToReplace = targetNode.arguments[argument.position];

    if (!argToReplace) return content;

    return (
      content.slice(0, argToReplace.getStart()) +
      argument.new +
      content.slice(argToReplace.getEnd())
    );
  }, fileContent);
}

function removeWebpackSpecificCode(fileContent: string): string {
  const sourceFile = parseTsFileContent(fileContent);

  // Find all nodes we want to remove
  const variableNodes = findNodes(sourceFile, ts.SyntaxKind.VariableStatement);
  const ifNodes = findNodes(sourceFile, ts.SyntaxKind.IfStatement);
  const nodes = [...variableNodes, ...ifNodes];

  // Filter and sort nodes in reverse order (to not affect positions)
  const nodesToRemove = nodes
    .filter((node) => {
      // For variable declarations
      if (ts.isVariableStatement(node)) {
        const declaration = node.declarationList.declarations[0];
        if (!declaration) return false;

        // Check for the declare const __non_webpack_require__
        if (
          node.modifiers?.some(
            (mod) => mod.kind === ts.SyntaxKind.DeclareKeyword
          )
        ) {
          return (
            ts.isIdentifier(declaration.name) &&
            declaration.name.text === '__non_webpack_require__'
          );
        }

        // Check for const mainModule or moduleFilename
        return (
          ts.isIdentifier(declaration.name) &&
          (declaration.name.text === 'mainModule' ||
            declaration.name.text === 'moduleFilename')
        );
      }

      // For if statement
      if (ts.isIfStatement(node)) {
        const condition = node.expression;
        return (
          condition.getText().includes('moduleFilename === __filename') ||
          condition.getText().includes("moduleFilename.includes('iisnode')")
        );
      }

      return false;
    })
    .sort((a, b) => b.getStart() - a.getStart());

  // Remove the nodes one by one
  return nodesToRemove.reduce((content, node) => {
    const start = node.getFullStart(); // Include leading trivia
    const end = node.getEnd();
    return content.slice(0, start) + content.slice(end);
  }, fileContent);
}

function removeMainServerTsReexport(fileContent: string): string {
  const sourceFile = parseTsFileContent(fileContent);

  const nodes = findNodes(sourceFile, ts.SyntaxKind.ExportDeclaration);

  const exportNode = nodes.find((node) => {
    if (!ts.isExportDeclaration(node)) return false;
    const moduleSpecifier = node.moduleSpecifier;
    if (!moduleSpecifier) return false;
    return (
      ts.isStringLiteral(moduleSpecifier) &&
      moduleSpecifier.text === './src/main.server'
    );
  });

  if (!exportNode) {
    return fileContent;
  }

  const start = exportNode.getFullStart(); // Include leading trivia
  const end = exportNode.getEnd();
  return fileContent.slice(0, start) + fileContent.slice(end);
}

function removeWebpackSpecificComments(fileContent: string): string {
  return (
    fileContent
      .replace(
        /\/\/ Webpack will replace 'require' with '__webpack_require__'\n/,
        ''
      )
      .replace(
        /\/\/ '__non_webpack_require__' is a proxy to Node 'require'\n/,
        ''
      )
      .replace(
        /\/\/ The below code is to ensure that the server is run only when not requiring the bundle\.\n/,
        ''
      ) + `\nrun()\n`
  );
}

/**
 * Updates `server.ts` file for new Angular v17 standards.
 *
 * Modernizes imports, configures new paths for `index.html` file,
 * removes Webpack-specific code, and removes obsolete export.
 */
export function updateServerTs(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const serverTsPath = 'server.ts';

    context.logger.info(`⏳ Updating ${serverTsPath} implementation...`);

    if (!tree.exists(serverTsPath)) {
      context.logger.warn(`⚠️ ${serverTsPath} file not found`);
      return;
    }

    const content = tree.read(serverTsPath);
    if (!content) {
      throw new Error(`Failed to read ${serverTsPath} file`);
    }

    let updatedContent = content.toString();

    updatedContent = removeImportsFromServerTs(updatedContent);

    updatedContent = addImportsToServerTs(updatedContent);

    updatedContent = replaceVariableDeclaration({
      fileContent: updatedContent,
      variableName: 'distFolder',
      newDeclaration: `const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');`,
    });

    updatedContent = replaceVariableDeclaration({
      fileContent: updatedContent,
      variableName: 'indexHtml',
      newDeclaration: `const indexHtml = join(browserDistFolder, 'index.html');`,
    });

    // Change `server.set(_, distFolder)` to `server.set(_, browserDistFolder)`
    updatedContent = replaceMethodCallArgument({
      fileContent: updatedContent,
      objectName: 'server',
      methodName: 'set',
      argument: {
        position: 1,
        old: 'distFolder',
        new: 'browserDistFolder',
      },
    });

    // Change `express.static(distFolder, ...)` to `express.static(browserDistFolder, ...)`
    updatedContent = replaceMethodCallArgument({
      fileContent: updatedContent,
      objectName: 'express',
      methodName: 'static',
      argument: {
        position: 0,
        old: 'distFolder',
        new: 'browserDistFolder',
      },
    });

    updatedContent = removeWebpackSpecificComments(updatedContent);

    updatedContent = removeWebpackSpecificCode(updatedContent);

    updatedContent = removeMainServerTsReexport(updatedContent);

    tree.overwrite(serverTsPath, updatedContent);

    context.logger.info(`✅ Updated ${serverTsPath} implementation`);
  };
}
