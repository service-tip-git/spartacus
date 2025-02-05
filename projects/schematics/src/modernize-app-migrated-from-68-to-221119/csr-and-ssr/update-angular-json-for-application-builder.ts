/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '../../shared/utils/workspace-utils';
import { printErrorWithAdviceToFollowDocs } from '../fallback-advice-to-follow-docs';

/**
 * Updates the Angular configuration file to new Angular v17 standards.
 *
 * Configures the new Angular application builder:
 * '@angular-devkit/build-angular:application',
 * updates output paths, and removes obsolete build options.
 */
export function updateAngularJsonForApplicationBuilder(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info(
      '\n⏳ Updating angular.json for application builder...'
    );

    const { workspace, path } = getWorkspace(tree);
    const project = workspace.projects[Object.keys(workspace.projects)[0]];

    if (!project) {
      printErrorWithAdviceToFollowDocs(
        'No project found in workspace',
        context
      );
      return;
    }

    const buildTarget = project.architect?.build as any;
    if (!buildTarget) {
      printErrorWithAdviceToFollowDocs(
        'No build target found in project configuration',
        context
      );
      return;
    }

    // Update builder
    buildTarget.builder = '@angular-devkit/build-angular:application';

    // Rename main to browser
    const options = buildTarget.options as any;
    if (options?.main) {
      options.browser = options.main;
      delete options.main;
    } else {
      printErrorWithAdviceToFollowDocs(
        'Could not rename "main" to "browser" in angular.json',
        context
      );
      return;
    }

    // Update development configuration
    const devConfig = buildTarget.configurations?.development as any;
    if (devConfig) {
      delete devConfig.buildOptimizer;
      delete devConfig.vendorChunk;
      delete devConfig.namedChunks;
    } else {
      printErrorWithAdviceToFollowDocs(
        'Could not update "development" configuration in angular.json',
        context
      );
      return;
    }

    context.logger.info('✅ Updated angular.json for application builder');
    tree.overwrite(path, JSON.stringify(workspace, null, 2));
  };
}
