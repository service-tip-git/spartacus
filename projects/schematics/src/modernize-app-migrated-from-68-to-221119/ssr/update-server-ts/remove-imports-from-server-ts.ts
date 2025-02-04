import { removeImportFromContent } from '../../../shared/utils/file-utils';

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
  importsToRemove.forEach((importToRemove) => {
    updatedContent = removeImportFromContent(updatedContent, importToRemove);
  });

  return updatedContent;
}
