import { RemoveChange } from '@schematics/angular/utility/change';
import {
  parseTsFileContent,
  removeImport,
} from '../../../shared/utils/file-utils';

/**
 * Removes imports from server.ts file, to align with Angular v17 standards.
 *
 * ```diff
 * - import 'zone.js/node';
 *
 * - import { ngExpressEngine as engine } from - '@spartacus/setup/ssr';
 * - import { NgExpressEngineDecorator } from - '@spartacus/setup/ssr';
 * - import * as express from 'express';
 * - import { join } from 'path';
 *
 * - import { AppServerModule } from './src/main.- server';
 * - import { APP_BASE_HREF } from '@angular/common';
 * - import { existsSync } from 'fs';
 * ```
 */
export function removeImportsFromServerTs(updatedContent: string): string {
  const sourceFile = parseTsFileContent(updatedContent);

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
  const importRemovalChanges = importsToRemove.map((importToRemove) =>
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
