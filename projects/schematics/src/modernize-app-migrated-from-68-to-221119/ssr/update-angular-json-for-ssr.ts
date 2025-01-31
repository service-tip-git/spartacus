import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '../../shared/utils/workspace-utils';

/**
 * Updates the Angular configuration related to SSR for new Angular v17 standards.
 *
 * 1. In the section `architect > build > options` it adds 3 new options with values:
 *    `"server": "src/main.server.ts"`,
 *    `"prerender": false`,
 *     `"ssr": { "entry": "server.ts" }`
 *
 * 2. In the section `architect > build > configurations` it adds a new property with object value
 *    `"noSsr": { "ssr": false, "prerender": false }`
 *
 * 3. In the section `architect > serve > configurations` it adds the ending `,noSsr` (with the preceding comma)
 *    at the end of the string values in subsections
 *    `... > production > buildTarget` and
 *    `... > development > buildTarget`
 *
 * 4. It removes the whole 3 sections `architect > server`, `architect > serve-ssr` and `architect > prerender`
 *    (because their responsibilities are now handled just by the single new Angular `application` builder)
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

    // Update serve configurations with `,noSsr`
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

    // Remove obsolete architect targets
    delete project.architect?.server;
    delete project.architect?.['serve-ssr'];
    delete project.architect?.prerender;

    tree.overwrite(path, JSON.stringify(workspace, null, 2));
    context.logger.info('✅ Updated angular.json for SSR');
  };
}
