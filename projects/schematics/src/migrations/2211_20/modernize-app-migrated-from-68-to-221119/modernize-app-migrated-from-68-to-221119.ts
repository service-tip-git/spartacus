/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Rule,
  SchematicContext,
  Tree,
  chain,
} from '@angular-devkit/schematics';
import { getWorkspace } from '../../../shared/utils/workspace-utils';
import * as ts from 'typescript';
import { insertImport } from '@schematics/angular/utility/ast-utils';
import { Change, InsertChange } from '@schematics/angular/utility/change';
import { removeImport, ClassType } from '../../../shared/utils/file-utils';

/**
 * Migrates the Angular application to use the new application builder
 */
function migrateToApplicationBuilder(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const { workspace, path } = getWorkspace(tree);
    const project = workspace.projects[Object.keys(workspace.projects)[0]];

    if (!project) {
      return;
    }

    const buildTarget = project.architect?.build as any;
    if (!buildTarget) {
      return;
    }

    // Update builder
    buildTarget.builder = '@angular-devkit/build-angular:application';

    // Update options
    const options = buildTarget.options as any;
    if (options) {
      // Update outputPath
      if (
        typeof options.outputPath === 'string' &&
        options.outputPath.endsWith('/browser')
      ) {
        options.outputPath = options.outputPath.replace(/\/browser$/, '');
      }

      // Rename main to browser
      if (options.main) {
        options.browser = options.main;
        delete options.main;
      }
    }

    // Update development configuration
    const devConfig = buildTarget.configurations?.development as any;
    if (devConfig) {
      delete devConfig.buildOptimizer;
      delete devConfig.vendorChunk;
      delete devConfig.namedChunks;
    }

    tree.overwrite(path, JSON.stringify(workspace, null, 2));
  };
}

/**
 * Updates TypeScript configurations
 */
function updateTsConfig(): Rule {
  return (tree: Tree) => {
    // Update tsconfig.json
    const tsconfigPath = 'tsconfig.json';
    if (tree.exists(tsconfigPath)) {
      const tsConfigContent = tree.read(tsconfigPath);
      if (tsConfigContent) {
        const tsConfig = JSON.parse(tsConfigContent.toString());

        if (tsConfig.compilerOptions) {
          delete tsConfig.compilerOptions.baseUrl;
          delete tsConfig.compilerOptions.forceConsistentCasingInFileNames;
          delete tsConfig.compilerOptions.downlevelIteration;

          tsConfig.compilerOptions.skipLibCheck = true;
          tsConfig.compilerOptions.esModuleInterop = true;
        }

        tree.overwrite(tsconfigPath, JSON.stringify(tsConfig, null, 2));
      }
    }
  };
}

/**
 * Updates SSR-specific configurations
 */
function migrateSSRConfig(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const { workspace, path } = getWorkspace(tree);
    const project = workspace.projects[Object.keys(workspace.projects)[0]];

    if (!project) {
      return;
    }

    const buildTarget = project.architect?.build as any;
    if (!buildTarget) {
      return;
    }

    // Add SSR options
    if (buildTarget.options) {
      const options = buildTarget.options as any;
      options.server = 'src/main.server.ts';
      options.prerender = false;
      options.ssr = {
        entry: 'server.ts',
      };
    }

    // Add noSsr configuration
    if (buildTarget.configurations) {
      buildTarget.configurations.noSsr = {
        ssr: false,
        prerender: false,
      };
    }

    // Update serve configurations
    const serveTarget = project.architect?.serve as any;
    if (serveTarget?.configurations) {
      if (serveTarget.configurations.production?.buildTarget) {
        serveTarget.configurations.production.buildTarget += ',noSsr';
      }
      if (serveTarget.configurations.development?.buildTarget) {
        serveTarget.configurations.development.buildTarget += ',noSsr';
      }
    }

    // Remove obsolete targets
    delete project.architect?.server;
    delete project.architect?.['serve-ssr'];
    delete project.architect?.prerender;

    tree.overwrite(path, JSON.stringify(workspace, null, 2));
  };
}

/**
 * Updates package.json scripts with the correct app name
 */
function updatePackageJsonScripts(): Rule {
  return (tree: Tree) => {
    if (!tree.exists('package.json')) {
      return;
    }

    // Get app name from workspace
    const { workspace } = getWorkspace(tree);
    const projectName = Object.keys(workspace.projects)[0];
    if (!projectName) {
      return;
    }

    const content = tree.read('package.json');
    if (!content) {
      return;
    }

    const packageJson = JSON.parse(content.toString());

    if (packageJson.scripts) {
      // Remove scripts
      delete packageJson.scripts['dev:ssr'];
      delete packageJson.scripts['prerender'];

      // Update scripts
      if (packageJson.scripts['build:ssr']) {
        packageJson.scripts['build:ssr'] = 'ng build';
      }
      if (packageJson.scripts['serve:ssr']) {
        packageJson.scripts[`serve:ssr:${projectName}`] =
          `node dist/${projectName}/server/server.mjs`;
      }
    }

    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));
  };
}

/**
 * Updates tsconfig.app.json and tsconfig.server.json for SSR projects
 */
function updateTsConfigsForSsr(): Rule {
  return (tree: Tree) => {
    // Update tsconfig.app.json
    const tsconfigAppPath = 'tsconfig.app.json';
    if (tree.exists(tsconfigAppPath)) {
      const tsConfigAppContent = tree.read(tsconfigAppPath);
      if (tsConfigAppContent) {
        const tsConfigApp = JSON.parse(tsConfigAppContent.toString());

        // Add node types
        if (!tsConfigApp.types) {
          tsConfigApp.types = [];
        }
        if (!tsConfigApp.types.includes('node')) {
          tsConfigApp.types.push('node');
        }

        // Add 'main.server.ts' and 'server.ts' to files
        if (!tsConfigApp.files) {
          tsConfigApp.files = [];
        }
        const mainServerTsPath = 'src/main.server.ts';
        if (!tsConfigApp.files.includes(mainServerTsPath)) {
          tsConfigApp.files.push(mainServerTsPath);
        }
        const serverTsPath = 'server.ts';
        if (!tsConfigApp.files.includes(serverTsPath)) {
          tsConfigApp.files.push(serverTsPath);
        }

        tree.overwrite(tsconfigAppPath, JSON.stringify(tsConfigApp, null, 2));
      }
    }

    // Remove tsconfig.server.json
    const tsconfigServerPath = 'tsconfig.server.json';
    if (tree.exists(tsconfigServerPath)) {
      tree.delete(tsconfigServerPath);
    }
  };
}

/**
 * Renames app.server.module.ts to app.module.server.ts
 */
function renameAppServerModule(): Rule {
  return (tree: Tree) => {
    // Rename app.server.module.ts to app.module.server.ts
    const appServerModulePath_OLD = 'src/app/app.server.module.ts';
    const appModuleServerPath_NEW = 'src/app/app.module.server.ts';
    if (tree.exists(appServerModulePath_OLD)) {
      const content = tree.read(appServerModulePath_OLD);
      if (content) {
        tree.create(appModuleServerPath_NEW, content.toString());
        tree.delete(appServerModulePath_OLD);
      }
    }
  };
}

/**
 * Updates main.server.ts to import AppServerModule from new path and export as default
 */
function updateMainServerTs(): Rule {
  return (tree: Tree) => {
    // Update main.server.ts
    const mainServerPath = 'src/main.server.ts';
    if (tree.exists(mainServerPath)) {
      const mainServerContent = tree.read(mainServerPath);
      if (mainServerContent) {
        const updatedContent = mainServerContent
          .toString()
          .replace(
            /export \{ AppServerModule \} from '\.\/app\/app\.server\.module';/,
            "export { AppServerModule as default } from './app/app.module.server';"
          );
        tree.overwrite(mainServerPath, updatedContent);
      }
    }
  };
}

/**
 * Updates server.ts with new Angular v17 configuration
 */
function updateServerTs(): Rule {
  return (tree: Tree) => {
    const serverTsPath = 'server.ts';
    if (!tree.exists(serverTsPath)) {
      return;
    }

    const content = tree.read(serverTsPath);
    if (!content) {
      return;
    }

    const sourceText = content.toString();
    const sourceFile = ts.createSourceFile(
      'server.ts',
      sourceText,
      ts.ScriptTarget.Latest,
      true
    );

    // List of imports to remove
    const importsToRemove: ClassType[] = [
      { className: 'zone', importPath: 'zone.js/node' },
      { className: 'ngExpressEngine', importPath: '@spartacus/setup/ssr' },
      {
        className: 'NgExpressEngineDecorator',
        importPath: '@spartacus/setup/ssr',
      },
      { className: 'express', importPath: 'express' },
      { className: 'join', importPath: 'path' },
      { className: 'AppServerModule', importPath: './src/main.server' },
      { className: 'APP_BASE_HREF', importPath: '@angular/common' },
      { className: 'existsSync', importPath: 'fs' },
    ];

    // List of new imports to add
    const importsToAdd = [
      {
        moduleSpecifier: '@angular/common',
        symbolName: 'APP_BASE_HREF',
        isDefault: false,
      },
      {
        moduleSpecifier: '@spartacus/setup/ssr',
        symbolName: 'NgExpressEngineDecorator',
        isDefault: false,
      },
      {
        moduleSpecifier: '@spartacus/setup/ssr',
        symbolName: 'ngExpressEngine',
        isDefault: false,
        asName: 'engine',
      },
      {
        moduleSpecifier: 'express',
        symbolName: 'express',
        isDefault: true,
      },
      {
        moduleSpecifier: 'node:path',
        symbolName: 'dirname',
        isDefault: false,
      },
      {
        moduleSpecifier: 'node:path',
        symbolName: 'join',
        isDefault: false,
      },
      {
        moduleSpecifier: 'node:path',
        symbolName: 'resolve',
        isDefault: false,
      },
      {
        moduleSpecifier: 'node:url',
        symbolName: 'fileURLToPath',
        isDefault: false,
      },
      {
        moduleSpecifier: './src/main.server',
        symbolName: 'AppServerModule',
        isDefault: true,
      },
    ];

    let updatedContent = sourceText;

    // Remove old imports using our utility
    const importRemovalChanges: Change[] = importsToRemove.map(
      (importToRemove) => removeImport(sourceFile, importToRemove)
    );

    // Apply changes for removing imports
    importRemovalChanges.forEach((change) => {
      if (change instanceof InsertChange) {
        const start = change.pos;
        updatedContent =
          updatedContent.slice(0, start) +
          change.toAdd +
          updatedContent.slice(start);
      }
    });

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
        imp.moduleSpecifier,
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
  };
}

/**
 * Updates app.module.ts with new Angular APIs
 */
function updateAppModule(): Rule {
  return (tree: Tree) => {
    const appModulePath = 'src/app/app.module.ts';
    if (!tree.exists(appModulePath)) {
      return;
    }

    const content = tree.read(appModulePath);
    if (!content) {
      return;
    }

    let sourceText = content.toString();

    // Remove HttpClientModule from imports
    sourceText = sourceText.replace(/HttpClientModule,?\s*/g, '');
    sourceText = sourceText.replace(
      /import\s*{\s*HttpClientModule\s*}\s*from\s*'@angular\/common\/http'\s*;\s*\n?/g,
      ''
    );

    // Add provideHttpClient to providers
    if (!sourceText.includes('provideHttpClient')) {
      sourceText = sourceText.replace(
        /providers:\s*\[/,
        'providers: [\n    provideHttpClient(withFetch(), withInterceptorsFromDi()),'
      );

      // Add imports
      const httpImport =
        "import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';\n";
      if (sourceText.includes('import {')) {
        sourceText = sourceText.replace(/import {/, `${httpImport}import {`);
      } else {
        // Add at the top after any license comments
        sourceText = sourceText.replace(
          /^(\s*\/\*[\s\S]*?\*\/\s*)?/,
          `$1${httpImport}\n`
        );
      }
    }

    // For SSR apps, update BrowserModule
    sourceText = sourceText.replace(
      /BrowserModule\.withServerTransition\(\s*{\s*appId:\s*['"]serverApp['"]\s*}\s*\)/,
      'BrowserModule'
    );

    tree.overwrite(appModulePath, sourceText);
  };
}

/**
 * Main migration function that orchestrates all the migration steps
 */
export function migrate(): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      migrateToApplicationBuilder,
      updateTsConfig,

      // SPIKE TODO: DO IT ONLY IN SSR PROJECTS:
      migrateSSRConfig,
      updatePackageJsonScripts,
      updateTsConfigsForSsr,
      renameAppServerModule,
      updateMainServerTs,
      updateServerTs,
      // END - SPIKE TODO: DO IT ONLY IN SSR PROJECTS

      updateAppModule,
    ]);
  };
}
