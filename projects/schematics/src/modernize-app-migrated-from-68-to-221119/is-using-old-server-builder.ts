import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { getWorkspace } from '../shared';

/**
 * Returns whether the application is using the old SSR builder.
 */
export function isUsingOldServerBuilder(
  tree: Tree,
  context: SchematicContext
): boolean {
  // check if the workspace settings has "server" in the "architect" section
  const { workspace } = getWorkspace(tree);
  const project = workspace.projects[Object.keys(workspace.projects)[0]];

  if (!project) {
    context.logger.warn('⚠️ No project found in workspace');
    return false;
  }

  const serverTarget = project.architect?.server as any;
  return !!serverTarget;
}
