import { SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * Returns whether the app is using SSR
 *
 * It checks if the `server.ts` file exists in the root folder.
 */
export function isUsingSsr(tree: Tree, _context: SchematicContext): boolean {
  return tree.exists('server.ts');
}
