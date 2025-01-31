import * as ts from 'typescript';
import { Change, RemoveChange } from '@schematics/angular/utility/change';
import { removeImport } from '../../../shared/utils/file-utils';

/**
 * Removes imports from server.ts file, to align with Angular v17 standards.
 */
export function removeImportsFromServerTs(
  updatedContent: string,
  sourceFile: ts.SourceFile
): string {
  // List of imports to remove
  const importsToRemove: { symbolName?: string; importPath: string }[] = [
    { importPath: 'zone.js/node' },
    { symbolName: 'ngExpressEngine', importPath: '@spartacus/setup/ssr' },
    {
      symbolName: 'NgExpressEngineDecorator',
      importPath: '@spartacus/setup/ssr',
    },
    { symbolName: 'express', importPath: 'express' },
    { symbolName: 'join', importPath: 'path' },
    { symbolName: 'AppServerModule', importPath: './src/main.server' },
    { symbolName: 'APP_BASE_HREF', importPath: '@angular/common' },
    { symbolName: 'existsSync', importPath: 'fs' },
  ];

  // Remove old imports using our utility
  const importRemovalChanges: Change[] = importsToRemove.map((importToRemove) =>
    removeImport(sourceFile, {
      className: importToRemove.symbolName,
      importPath: importToRemove.importPath,
    })
  );

  // Apply changes for removing imports
  importRemovalChanges.forEach((change) => {
    if (change instanceof RemoveChange) {
      const searchText = change.toRemove;
      const searchIndex = updatedContent.indexOf(searchText);
      if (searchIndex !== -1) {
        updatedContent =
          updatedContent.slice(0, searchIndex) +
          updatedContent.slice(searchIndex + searchText.length);
      }
    }
  });

  return updatedContent;
}
