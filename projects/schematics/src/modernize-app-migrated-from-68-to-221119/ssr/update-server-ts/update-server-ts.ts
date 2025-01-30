import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { removeImportsFromServerTs } from './remove-imports-from-server-ts';
import { addImportsToServerTs } from './add-imports-to-server-ts';
import { findNodes } from '@schematics/angular/utility/ast-utils';

function replaceVariableDeclaration(
  sourceFile: ts.SourceFile,
  fileContent: string,
  variableName: string,
  newDeclaration: string
): string {
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

function replaceMethodCallArgument(
  sourceFile: ts.SourceFile,
  fileContent: string,
  objectName: string,
  methodName: string,
  oldArgName: string,
  newArgName: string,
  argPosition?: number
): string {
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

    // If argPosition is specified, check if the argument at that position is what we want to replace
    if (typeof argPosition === 'number') {
      const arg = node.arguments[argPosition];
      return ts.isIdentifier(arg) && arg.text === oldArgName;
    }

    // Otherwise check if any argument matches what we want to replace
    return node.arguments.some(
      (arg) => ts.isIdentifier(arg) && arg.text === oldArgName
    );
  });

  if (!targetNodes.length) {
    return fileContent;
  }

  // Process all matches
  return targetNodes.reduce((content, targetNode) => {
    if (!ts.isCallExpression(targetNode)) return content;

    // Find the argument to replace
    let argToReplace: ts.Node | undefined;
    if (typeof argPosition === 'number') {
      argToReplace = targetNode.arguments[argPosition];
    } else {
      argToReplace = targetNode.arguments.find(
        (arg) => ts.isIdentifier(arg) && arg.text === oldArgName
      );
    }

    if (!argToReplace) return content;

    return (
      content.slice(0, argToReplace.getStart()) +
      newArgName +
      content.slice(argToReplace.getEnd())
    );
  }, fileContent);
}

function removeWebpackSpecificCode(
  sourceFile: ts.SourceFile,
  fileContent: string
): string {
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

function removeExportStatement(
  sourceFile: ts.SourceFile,
  fileContent: string
): string {
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

    const sourceText = content.toString();
    const sourceFile = ts.createSourceFile(
      'server.ts',
      sourceText,
      ts.ScriptTarget.Latest,
      true
    );

    let updatedContent = sourceText;

    updatedContent = removeImportsFromServerTs(updatedContent, sourceFile);

    // Create new source file after removals
    const updatedSourceFile = ts.createSourceFile(
      serverTsPath,
      updatedContent,
      ts.ScriptTarget.Latest,
      true
    );

    updatedContent = addImportsToServerTs(
      updatedContent,
      updatedSourceFile,
      serverTsPath
    );

    const updatedSourceFileAfterImports = ts.createSourceFile(
      serverTsPath,
      updatedContent,
      ts.ScriptTarget.Latest,
      true
    );

    // Update dist folder declaration
    updatedContent = replaceVariableDeclaration(
      updatedSourceFileAfterImports,
      updatedContent,
      'distFolder',
      `const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');`
    );

    // Create new source file after first update
    const sourceFileAfterDistFolder = ts.createSourceFile(
      serverTsPath,
      updatedContent,
      ts.ScriptTarget.Latest,
      true
    );

    // Update index.html declaration
    updatedContent = replaceVariableDeclaration(
      sourceFileAfterDistFolder,
      updatedContent,
      'indexHtml',
      `const indexHtml = join(browserDistFolder, 'index.html');`
    );

    // Create new source file after second update
    const sourceFileAfterIndexHtml = ts.createSourceFile(
      serverTsPath,
      updatedContent,
      ts.ScriptTarget.Latest,
      true
    );

    // Update server configuration using AST
    updatedContent = replaceMethodCallArgument(
      sourceFileAfterIndexHtml,
      updatedContent,
      'server',
      'set',
      'distFolder',
      'browserDistFolder',
      1 // second argument
    );

    const sourceFileAfterServerSet = ts.createSourceFile(
      serverTsPath,
      updatedContent,
      ts.ScriptTarget.Latest,
      true
    );

    updatedContent = replaceMethodCallArgument(
      sourceFileAfterServerSet,
      updatedContent,
      'express',
      'static',
      'distFolder',
      'browserDistFolder',
      0 // first argument
    );

    // Remove webpack-specific code using AST
    const sourceFileBeforeWebpackRemoval = ts.createSourceFile(
      serverTsPath,
      updatedContent,
      ts.ScriptTarget.Latest,
      true
    );

    updatedContent = removeWebpackSpecificCode(
      sourceFileBeforeWebpackRemoval,
      updatedContent
    );

    // Create new source file after webpack code removal
    const sourceFileBeforeExportRemoval = ts.createSourceFile(
      serverTsPath,
      updatedContent,
      ts.ScriptTarget.Latest,
      true
    );

    // Remove export statement
    updatedContent = removeExportStatement(
      sourceFileBeforeExportRemoval,
      updatedContent
    );

    // Remove webpack-specific comments with regex
    updatedContent = updatedContent
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
      );

    // Add run() call
    updatedContent += 'run();\n';

    tree.overwrite(serverTsPath, updatedContent);

    context.logger.info(`✅ Updated ${serverTsPath} implementation`);
  };
}
