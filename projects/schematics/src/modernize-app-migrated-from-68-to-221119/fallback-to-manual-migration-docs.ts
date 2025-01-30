import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

/**
 * URL where to find the manual migration steps.
 */
export const DOCS_FOR_MODERNIZING_NG17_APP =
  'https://help.sap.com/docs/SAP_COMMERCE_COMPOSABLE_STOREFRONT';

/**
 * Higher-order function that wraps a Rule with error handling.
 * If the wrapped Rule throws an error, it logs the error and provides a link to manual migration docs.
 */
export function withFallbackToManualMigrationDocs(rule: Rule): Rule {
  return (tree: Tree, context: SchematicContext) => {
    try {
      return rule(tree, context);
    } catch (err) {
      context.logger.error(
        `⚠️ ${err instanceof Error ? err.message : 'Unknown error'}`
      );
      context.logger.warn(
        `Please follow the manual migration steps at: ${DOCS_FOR_MODERNIZING_NG17_APP}`
      );
      return tree;
    }
  };
}
