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

    // Remove webpack-specific code
    updatedContent = updatedContent.replace(
      /\/\/\s*Webpack will replace ['"]require['"]\s*with\s*['"]__webpack_require__['"][\s\S]*?export\s*\*\s*from\s*['"]\.\/src\/main\.server['"];\s*$/,
      'run();'
    );

    // Remove the old import
    updatedContent = updatedContent.replace(
      /import\s*{\s*AppServerModule\s*}\s*from\s*['"]\.\/src\/main\.server['"];\s*$/,
      ''
    );

    tree.overwrite(serverTsPath, updatedContent);

    context.logger.info(`✅ Updated ${serverTsPath} implementation`);
  };
}
