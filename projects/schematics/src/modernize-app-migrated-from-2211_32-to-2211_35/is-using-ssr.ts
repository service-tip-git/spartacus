/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * Returns whether the app is using SSR
 *
 * It checks if the `server.ts` file exists in the root folder.
 */
export function isUsingSsr(tree: Tree, _context: SchematicContext): boolean {
  return tree.exists('server.ts');
}
