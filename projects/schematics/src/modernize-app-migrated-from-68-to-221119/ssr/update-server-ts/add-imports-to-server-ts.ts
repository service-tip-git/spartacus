import { insertImport } from '@schematics/angular/utility/ast-utils';
import { Change, InsertChange } from '@schematics/angular/utility/change';
import { parseTsFileContent } from '../../../shared/utils/file-utils';

/**
 * Adds new imports to server.ts file, to align with Angular v17 standards.
 *
 * ```diff
 * + import { APP_BASE_HREF } from '@angular/common';
 * + import {
 * +   NgExpressEngineDecorator,
 * +   ngExpressEngine as engine,
 * + } from '@spartacus/setup/ssr';
 * + import express from 'express';
 * + import { dirname, join, resolve } from 'node:path';
 * + import { fileURLToPath } from 'node:url';
 * + import AppServerModule from './src/main.server';
```
 */
export function addImportsToServerTs(updatedContent: string): string {
  const sourceFile = parseTsFileContent(updatedContent);

  // List of new imports to add
  const importsToAdd: {
    importPath: string;
    symbolName: string;
    isDefault?: boolean;
    asName?: string;
  }[] = [
    {
      importPath: '@angular/common',
      symbolName: 'APP_BASE_HREF',
    },
    {
      importPath: '@spartacus/setup/ssr',
      symbolName: 'NgExpressEngineDecorator',
    },
    {
      importPath: '@spartacus/setup/ssr',
      symbolName: 'ngExpressEngine',
      asName: 'engine',
    },
    {
      importPath: 'express',
      symbolName: 'express',
      isDefault: true,
    },
    {
      importPath: 'node:path',
      symbolName: 'dirname',
    },
    {
      importPath: 'node:path',
      symbolName: 'join',
    },
    {
      importPath: 'node:path',
      symbolName: 'resolve',
    },
    {
      importPath: 'node:url',
      symbolName: 'fileURLToPath',
    },
    {
      importPath: './src/main.server',
      symbolName: 'AppServerModule',
      isDefault: true,
    },
  ];

  // Add new imports
  const importAdditionChanges: Change[] = importsToAdd.map((imp) =>
    insertImport(
      sourceFile,
      '',
      imp.symbolName,
      imp.importPath,
      imp.isDefault,
      imp.asName
    )
  );

  // Apply changes for adding imports
  importAdditionChanges.forEach((change) => {
    if (change instanceof InsertChange) {
      const start = change.pos;
      updatedContent =
        updatedContent.slice(0, start) +
        change.toAdd +
        updatedContent.slice(start);
    }
  });

  return updatedContent;
}
