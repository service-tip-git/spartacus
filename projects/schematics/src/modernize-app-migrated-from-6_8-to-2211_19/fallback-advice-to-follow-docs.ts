/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * URL where to find the manual migration steps.
 */
export const DOCS_FOR_MODERNIZING_NG17_APP =
  'https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT';

export const FALLBACK_ADVICE_TO_FOLLOW_DOCS = `Could not update this file automatically. To complete the migration, please follow the manual steps: ${DOCS_FOR_MODERNIZING_NG17_APP}`;

/**
 * Prints an error message and a link to the manual migration steps.
 */
export function printErrorWithAdviceToFollowDocs(
  message: string,
  context: SchematicContext
) {
  context.logger.error(`⚠️ ${message}`);
  context.logger.error(FALLBACK_ADVICE_TO_FOLLOW_DOCS);
}

/**
 * If the wrapped Rule throws an error, it logs the error and prints a link to manual migration docs.
 */
export function withFallbackToShowingDocs(rule: Rule): Rule {
  return (tree: Tree, context: SchematicContext) => {
    try {
      return rule(tree, context);
    } catch (error) {
      printErrorWithAdviceToFollowDocs(
        error instanceof Error ? error.message : 'Unknown error',
        context
      );
      return tree;
    }
  };
}
