import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '../../shared/utils/workspace-utils';
import { printErrorWithDocsForMigrated_2211_32_To_2211_35 } from '../fallback-advice-to-follow-docs';
import {
  BrowserBuilderBaseOptions,
  BrowserBuilderTarget,
} from '@schematics/angular/utility/workspace-models';

export function updateAngularJson(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('\n⏳ Updating angular.json assets configuration...');

    const { workspace, path } = getWorkspace(tree);
    const project = workspace.projects[Object.keys(workspace.projects)[0]];

    if (!project) {
      printErrorWithDocsForMigrated_2211_32_To_2211_35(
        'No project found in workspace',
        context
      );
      return;
    }

    const buildTarget = project.architect?.build as BrowserBuilderTarget;
    const testTarget = project.architect?.test;

    if (!buildTarget) {
      printErrorWithDocsForMigrated_2211_32_To_2211_35(
        'Could not find "build" target in project configuration',
        context
      );
      return;
    }

    const oldAssets: BrowserBuilderBaseOptions['assets'] = [
      'src/favicon.ico',
      'src/assets',
    ];
    const newAssets: BrowserBuilderBaseOptions['assets'] = [
      { glob: '**/*', input: 'public' },
    ];

    // Update config for "build" target
    if (Array.isArray(buildTarget.options?.assets)) {
      context.logger.info(
        '  ↳ Replacing "src/favicon.ico" and "src/assets" with the new "/public" assets config in "build" options'
      );
      buildTarget.options.assets = buildTarget.options.assets.filter(
        (asset: string | object) => !oldAssets.includes(asset)
      );

      // Add the new public assets config
      buildTarget.options.assets = [
        ...newAssets,
        ...buildTarget.options.assets,
      ];
    }

    // Update config for "test" target
    if (Array.isArray(testTarget?.options?.assets)) {
      context.logger.info(
        '  ↳ Replacing "src/favicon.ico" and "src/assets" with the new "/public" assets config in "test" options'
      );
      testTarget.options.assets = testTarget.options.assets.filter(
        (asset: string | object) => !oldAssets.includes(asset)
      );

      // Add the new public assets config
      testTarget.options.assets = [...newAssets, ...testTarget.options.assets];
    } else {
      printErrorWithDocsForMigrated_2211_32_To_2211_35(
        'Could not find "test" target in project configuration',
        context
      );
    }

    tree.overwrite(path, JSON.stringify(workspace, null, 2));
    context.logger.info('✅ Updated angular.json assets configuration');
  };
}
