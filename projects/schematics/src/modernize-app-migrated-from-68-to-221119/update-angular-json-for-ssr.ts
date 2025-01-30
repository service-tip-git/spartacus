import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '../shared/utils/workspace-utils';

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
    const project = workspace.projects[Object.keys(workspace.projects)[0]];

    if (!project) {
      throw new Error('No project found for SSR migration');
    }

    const buildTarget = project.architect?.build as any;
    if (!buildTarget) {
      throw new Error('No build target found in project configuration');
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
    context.logger.info('✅ Updated angular.json for SSR');
  };
}
