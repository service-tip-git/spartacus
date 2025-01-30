import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import { insertImport } from '@schematics/angular/utility/ast-utils';
import {
  Change,
  InsertChange,
  RemoveChange,
} from '@schematics/angular/utility/change';
import { removeImport } from '../../../shared/utils/file-utils';

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

    let updatedContent = sourceText;

    updatedContent = removeImportsInServerTs(updatedContent, sourceFile);

    // Create new source file after removals
    const updatedSourceFile = ts.createSourceFile(
      serverTsPath,
      updatedContent,
      ts.ScriptTarget.Latest,
      true
    );

    // Add new imports
    const importAdditionChanges: Change[] = importsToAdd.map((imp) =>
      insertImport(
        updatedSourceFile,
        serverTsPath,
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

    // Update dist folder constants
    updatedContent = updatedContent.replace(
      /const\s+distFolder\s*=\s*join\s*\(\s*process\.cwd\s*\(\s*\)\s*,\s*['"]dist\/.*\/browser['"]\s*\)\s*;\s*\n*const\s+indexHtml\s*=\s*existsSync\s*\(\s*join\s*\(\s*distFolder\s*,\s*['"]index\.original\.html['"]\s*\)\s*\)\s*\n*\s*\?\s*['"]index\.original\.html['"]\s*\n*\s*:\s*['"]index['"]\s*;/,
      `const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(browserDistFolder, 'index.html');`
    );

    // Update server configuration
    updatedContent = updatedContent.replace(
      /server\.set\s*\(\s*['"]views['"]\s*,\s*distFolder\s*\)\s*;/g,
      `server.set('views', browserDistFolder);`
    );

    updatedContent = updatedContent.replace(
      /express\.static\s*\(\s*distFolder\s*,/g,
      `express.static(browserDistFolder,`
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

    tree.overwrite('server.ts', updatedContent);

    context.logger.info(`✅ Updated ${serverTsPath} implementation`);
  };
}

function removeImportsInServerTs(
  updatedContent: string,
  sourceFile: ts.SourceFile
): string {
  // List of imports to remove
  const importsToRemove: { symbolName: string; importPath: string }[] = [
    { symbolName: 'zone', importPath: 'zone.js/node' },
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
