/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '../../shared/utils/workspace-utils';

/**
 * Updates the Angular configuration file to new Angular v17 standards.
 *
 * Configures the new Angular application builder:
 * '@angular-devkit/build-angular:application',
 * updates output paths, and removes obsolete build options.
 */
export function updateAngularJsonForApplicationBuilder(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('⏳ Updating angular.json for application builder...');

    const { workspace, path } = getWorkspace(tree);
    const project = workspace.projects[Object.keys(workspace.projects)[0]];

    if (!project) {
      throw new Error('No project found in workspace');
    }

    const buildTarget = project.architect?.build as any;
    if (!buildTarget) {
      throw new Error('No build target found in project configuration');
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

    context.logger.info('✅ Updated angular.json for application builder');
    tree.overwrite(path, JSON.stringify(workspace, null, 2));
  };
}
