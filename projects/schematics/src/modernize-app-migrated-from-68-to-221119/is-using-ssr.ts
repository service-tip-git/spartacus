import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '../shared';

/**
 * Returns whether the app is using SSR
 *
 * It checks if the `angular.json` contains an old build architect named "server".
 */
export function isUsingSsr(tree: Tree, context: SchematicContext): boolean {
  const { workspace } = getWorkspace(tree);
  const project = workspace.projects[Object.keys(workspace.projects)[0]];

  if (!project) {
    context.logger.warn('⚠️ No project found in workspace');
    return false;
  }

  return !!project.architect?.server;
}
