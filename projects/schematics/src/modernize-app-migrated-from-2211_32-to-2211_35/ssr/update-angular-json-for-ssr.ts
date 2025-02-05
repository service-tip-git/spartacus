import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '../../shared/utils/workspace-utils';
import { printErrorWithAdviceToFollowDocs } from '../fallback-advice-to-follow-docs';
import { ApplicationBuilderOptions } from '@angular-devkit/build-angular';

export function updateAngularJsonForSsr(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('\n⏳ Updating angular.json for SSR...');

    const { workspace, path } = getWorkspace(tree);
    const project = workspace.projects[Object.keys(workspace.projects)[0]];

    if (!project) {
      printErrorWithAdviceToFollowDocs(
        'No project found in workspace',
        context
      );
      return;
    }

    const buildTarget = project.architect?.build as ApplicationBuilderOptions;
    if (!buildTarget) {
      printErrorWithAdviceToFollowDocs(
        'No build target found in project configuration',
        context
      );
      return;
    }

    const oldEntryPath = buildTarget.options.ssr.entry;
    const newEntryPath = 'src/server.ts';
    context.logger.info(
      `  ↳ Updating "ssr.entry" path in build target from "${oldEntryPath}" to "${newEntryPath}"`
    );
    if (buildTarget.options?.ssr?.entry) {
      buildTarget.options.ssr.entry = newEntryPath;
    } else {
      printErrorWithAdviceToFollowDocs(
        'No "ssr.entry" path found in build target',
        context
      );
      return;
    }

    tree.overwrite(path, JSON.stringify(workspace, null, 2));
    context.logger.info('✅ Updated angular.json for SSR');
  };
}
