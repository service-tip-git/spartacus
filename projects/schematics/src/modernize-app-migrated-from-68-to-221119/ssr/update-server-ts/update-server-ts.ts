import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { removeImportsFromServerTs } from './remove-imports-from-server-ts';
import { addImportsToServerTs } from './add-imports-to-server-ts';
import { findNodes } from '@schematics/angular/utility/ast-utils';
import { parseTsFileContent } from '../../../shared/utils/file-utils';
import { replaceMethodCallArgument } from 'projects/schematics/src/shared/utils/method-call-utils';
import { replaceVariableDeclaration } from 'projects/schematics/src/shared/utils/variable-utils';

/**
 * Removes the Webpack-specific comments.
 *
 *   ```diff
 *   - // Webpack will replace 'require' with '__webpack_require__'
 *   - // '__non_webpack_require__' is a proxy to Node 'require'
 *   - // The below code is to ensure that the server is run only when not requiring the bundle.
 */
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
 * Removes the Webpack-specific code and replaces with a simple `run()` call.
 *
 *   ```diff
 *   - declare const __non_webpack_require__: NodeRequire;
 *   - const mainModule = __non_webpack_require__.main;
 *   - const moduleFilename = (mainModule && mainModule.- filename) || '';
 *   - if (moduleFilename === __filename || moduleFilename.- includes('iisnode')) {
 *   -   run();
 *   - }
 *   + run();
 *   ```
 */
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

/**
 * Removes the re-export of the path `./src/main.server`.
 *
 *   ```diff
 *   - export * from './src/main.server';
 *   ```
 */
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

    /*
     * Removes `distFolder` variable declaration and replaces with 2 new variables:
     * `serverDistFolder` and `browserDistFolder`
     *
     *   ```diff
     *   - const distFolder = join(process.cwd(), 'dist/<APP-NAME>/browser');
     *   +  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
     *   +  const browserDistFolder = resolve(serverDistFolder, '../browser');
     *   ```
     */
    updatedContent = replaceVariableDeclaration({
      fileContent: updatedContent,
      variableName: 'distFolder',
      newDeclaration: `const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');`,
    });

    /*
     * Replace `indexHtml` variable declaration to use `browserDistFolder`
     *   ```diff
     *   - const indexHtml = existsSync(join(distFolder, 'index.original.html'))
     *   -   ? 'index.original.html'
     *   -   : 'index';
     *   +  const indexHtml = join(browserDistFolder, 'index.html');
     *   ```
     */
    updatedContent = replaceVariableDeclaration({
      fileContent: updatedContent,
      variableName: 'indexHtml',
      newDeclaration: `const indexHtml = join(browserDistFolder, 'index.html');`,
    });

    /*
     * Change `server.set(_, distFolder)` to `server.set(_, browserDistFolder)`
     *
     *   ```diff
     *   -  server.set('views', distFolder);
     *   +  server.set('views', browserDistFolder);
     *   ```
     */
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

    /*
     * Change `express.static(distFolder, { ... })` to `express.static(browserDistFolder, { ... })`
     *
     *   ```diff
     *   server.get(
     *     '*.*',
     *   -    express.static(distFolder, {
     *   +    express.static(browserDistFolder, {
     *   ```
     */
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
