/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '../../shared/utils/workspace-utils';

/**
 * Updates the Angular configuration related to SSR for new Angular v17 standards.
 *
 * Sets up SSR options in the build configuration, adds 'noSsr' mode,
 * and removes obsolete SSR-related architect sections.
 */
export function updateAngularJsonForSsr(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('⏳ Updating angular.json for SSR...');

    const { workspace, path } = getWorkspace(tree);
    const [firstProjectKey] = Object.keys(workspace.projects);
    const project = workspace.projects[firstProjectKey];

    if (!project) {
      throw new Error('No project found for SSR migration');
    }

    if (!project.architect?.build) {
      throw new Error('No build target found in project configuration');
    }

    // Update build target with SSR options
    project.architect.build = {
      ...project.architect.build,
      options: {
        ...(project.architect.build as any).options,
        server: 'src/main.server.ts',
        prerender: false,
        ssr: { entry: 'server.ts' },
      },
      configurations: {
        ...(project.architect.build as any).configurations,
        noSsr: { ssr: false, prerender: false },
      },
    };

    // Update serve configurations with noSsr
    const serveConfigs = project.architect?.serve?.configurations;
    if (serveConfigs) {
      project.architect.serve = {
        ...project.architect.serve,
        configurations: {
          ...serveConfigs,
          production: {
            ...serveConfigs.production,
            buildTarget: `${serveConfigs.production?.buildTarget},noSsr`,
          },
          development: {
            ...serveConfigs.development,
            buildTarget: `${serveConfigs.development?.buildTarget},noSsr`,
          },
        },
      } as any;
    }

    // Remove obsolete targets
    delete project.architect?.server;
    delete project.architect?.['serve-ssr'];
    delete project.architect?.prerender;

    tree.overwrite(path, JSON.stringify(workspace, null, 2));
    context.logger.info('✅ Updated angular.json for SSR');
  };
}
