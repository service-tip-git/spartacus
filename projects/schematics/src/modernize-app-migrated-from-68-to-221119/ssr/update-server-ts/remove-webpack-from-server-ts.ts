import { findNodes } from '@schematics/angular/utility/ast-utils';
import { parseTsFileContent } from '../../../shared/utils/file-utils';
import { removeVariableDeclaration } from '../../../shared/utils/variable-utils';
import * as ts from 'typescript';

/**
 * Removes the Webpack-specific comments.
 *
 *   ```diff
 *   - // Webpack will replace 'require' with '__webpack_require__'
 *   - // '__non_webpack_require__' is a proxy to Node 'require'
 *   - // The below code is to ensure that the server is run only when not requiring the bundle.
 */
function removeWebpackSpecificComments(fileContent: string): string {
  return fileContent
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
  let updatedContent = fileContent;

  updatedContent = removeVariableDeclaration({
    fileContent: updatedContent,
    variableName: '__non_webpack_require__',
  });

  updatedContent = removeVariableDeclaration({
    fileContent: updatedContent,
    variableName: 'mainModule',
  });

  updatedContent = removeVariableDeclaration({
    fileContent: updatedContent,
    variableName: 'moduleFilename',
  });

  // Remove if statement
  const sourceFile = parseTsFileContent(updatedContent);
  const ifNodes = findNodes(sourceFile, ts.SyntaxKind.IfStatement);
  const ifNode = ifNodes.find((node) => {
    if (!ts.isIfStatement(node)) {
      return false;
    }
    const condition = node.expression;
    return (
      condition.getText().includes('moduleFilename === __filename') &&
      condition.getText().includes("moduleFilename.includes('iisnode')")
    );
  });

  if (ifNode) {
    const start = ifNode.getFullStart();
    const end = ifNode.getEnd();
    updatedContent = updatedContent.slice(0, start) + updatedContent.slice(end);
  }

  // Add run() call
  return updatedContent + 'run();\n';
}

/**
 * Removes the Webpack-specific code and comments from the server.ts file.
 */
export function removeWebpackFromServerTs(updatedContent: string): string {
  updatedContent = removeWebpackSpecificComments(updatedContent);
  updatedContent = removeWebpackSpecificCode(updatedContent);
  return updatedContent;
}
