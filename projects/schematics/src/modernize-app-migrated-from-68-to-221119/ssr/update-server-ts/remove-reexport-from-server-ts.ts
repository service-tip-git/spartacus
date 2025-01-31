import { findNodes } from '@schematics/angular/utility/ast-utils';
import { parseTsFileContent } from '../../../shared/utils/file-utils';
import * as ts from 'typescript';

/**
 * Removes the re-export of the path `./src/main.server`.
 *
 *   ```diff
 *   - export * from './src/main.server';
 *   ```
 */
export function removeReexportFromServerTs(fileContent: string): string {
  const sourceFile = parseTsFileContent(fileContent);
  const nodes = findNodes(sourceFile, ts.SyntaxKind.ExportDeclaration);

  const exportNode = nodes.find((node) => {
    if (!ts.isExportDeclaration(node)) {
      return false;
    }
    const moduleSpecifier = node.moduleSpecifier;
    if (!moduleSpecifier) {
      return false;
    }
    return (
      ts.isStringLiteral(moduleSpecifier) &&
      moduleSpecifier.text === './src/main.server'
    );
  });

  if (!exportNode) {
    return fileContent;
  }

  const start = exportNode.getFullStart();
  const end = exportNode.getEnd();
  return fileContent.slice(0, start) + fileContent.slice(end);
}
