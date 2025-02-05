import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { printErrorWithDocsForMigrated_2211_32_To_2211_35 as printErrorWithDocs } from '../fallback-advice-to-follow-docs';
import * as ts from 'typescript';

/**
 * Updates the i18n lazy loading config to use the new path with the `public/` folder,
 * instead of `../../assets`, because of moving the assets folder with respect to the new Angular v19 standards.
 *
 * It checks whether the config for i18n lazy loading is present.
 * If it is, it updates the path from `../../assets` to `../../../public`.
 * Otherwise, no changes are made.
 */
export function updateI18nLazyLoadingConfig(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const configurationModulePath =
      'src/app/spartacus/spartacus-configuration.module.ts';
    context.logger.info(
      `\n⏳ Updating config for i18n lazy loading in "${configurationModulePath}", if needed...`
    );

    if (!tree.exists(configurationModulePath)) {
      printErrorWithDocs(`${configurationModulePath} file not found`, context);
      return;
    }

    const content = tree.read(configurationModulePath);
    if (!content) {
      printErrorWithDocs(
        `Failed to read ${configurationModulePath} file`,
        context
      );
      return;
    }

    let updatedContent = content.toString();

    context.logger.info(
      '    ↳ Checking if app has a config for i18n lazy loading...'
    );
    if (!hasConfigForLazyLoadingI18n(updatedContent)) {
      context.logger.info('      ↳ No.');
      context.logger.info(
        `✅ Updating config for i18n lazy loading in "${configurationModulePath}" was not needed`
      );
      return;
    }
    context.logger.info(
      '      ↳ Updating the path from "../../assets" to "../../../public"'
    );

    if (updatedContent.includes('import(`../../assets/')) {
      updatedContent = updatedContent.replace(
        /import\(`\.\.\/\.\.\/assets\//g,
        'import(`../../../public/'
      );
    } else {
      printErrorWithDocs(
        '  ↳ No i18n lazy loading config found that would need updating',
        context
      );
      return;
    }

    tree.overwrite(configurationModulePath, updatedContent);
    context.logger.info('✅ Updated config for i18n lazy loading');
  };
}

/**
 * Checks if the content has a config for lazy loaded i18n.
 *
 * It looks for an object literal with the following structure:
 * ```
 * {
 *   i18n: {
 *     backend: {
 *       loader: ...
 *     }
 *   }
 * }
 */
function hasConfigForLazyLoadingI18n(content: string): boolean {
  const sourceFile = ts.createSourceFile(
    '',
    content,
    ts.ScriptTarget.Latest,
    true
  );

  const objectLiterals = findObjectLiterals(sourceFile);
  const hasValidConfig = objectLiterals.some(isConfigForLazyLoadingI18n);
  return hasValidConfig;
}

/**
 * Checks if the given node is a config for lazy loaded i18n.
 *
 * It looks for an object literal with the following structure:
 * ```
 * {
 *   i18n: {
 *     backend: {
 *       loader: ...
 *     }
 *   }
 * }
 * ```
 */
function isConfigForLazyLoadingI18n(node: ts.ObjectLiteralExpression): boolean {
  const i18nProp = node.properties.find(
    (prop): prop is ts.PropertyAssignment =>
      ts.isPropertyAssignment(prop) &&
      ts.isIdentifier(prop.name) &&
      prop.name.text === 'i18n'
  );

  if (i18nProp && ts.isObjectLiteralExpression(i18nProp.initializer)) {
    const backendProp = i18nProp.initializer.properties.find(
      (prop): prop is ts.PropertyAssignment =>
        ts.isPropertyAssignment(prop) &&
        ts.isIdentifier(prop.name) &&
        prop.name.text === 'backend'
    );

    if (backendProp && ts.isObjectLiteralExpression(backendProp.initializer)) {
      return backendProp.initializer.properties.some(
        (prop) =>
          ts.isPropertyAssignment(prop) &&
          ts.isIdentifier(prop.name) &&
          prop.name.text === 'loader'
      );
    }
  }
  return false;
}

/**
 * Returns all object literals in the given node.
 */
function findObjectLiterals(node: ts.Node): ts.ObjectLiteralExpression[] {
  const objects: ts.ObjectLiteralExpression[] = [];

  if (ts.isObjectLiteralExpression(node)) {
    objects.push(node);
  }

  ts.forEachChild(node, (child) => {
    objects.push(...findObjectLiterals(child));
  });

  return objects;
}
