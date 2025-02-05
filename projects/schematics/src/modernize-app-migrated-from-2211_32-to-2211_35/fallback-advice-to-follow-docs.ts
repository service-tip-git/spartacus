import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * URL where to find the manual migration steps.
 */
export const DOCS_URL_FOR_MODERNIZING_APPS_MIGRATED_FROM_2211_32_TO_2211_35 =
  'https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT/10a8bc7f635b4e3db6f6bb7880e58a7d/525dd86b812544249e78d73f67f3e6ed.html';

export const FALLBACK_ADVICE_TO_FOLLOW_DOCS = `Could not update this file automatically. To complete the migration, please follow the manual steps: ${DOCS_URL_FOR_MODERNIZING_APPS_MIGRATED_FROM_2211_32_TO_2211_35}`;

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
export function withFallbackToDocsForModernizingFrom2211_31To2211_35(
  rule: Rule
): Rule {
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
