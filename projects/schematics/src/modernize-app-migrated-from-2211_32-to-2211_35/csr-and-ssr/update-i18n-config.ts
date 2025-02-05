import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { printErrorWithDocsForMigrated_2211_32_To_2211_35 as printErrorWithDocs } from '../fallback-advice-to-follow-docs';
import * as ts from 'typescript';

export function updateI18nConfig(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const configurationModulePath = 'src/app/spartacus-configuration.module.ts';
    context.logger.info(
      `\n⏳ Checking configuration for lazy loaded i18n assets in "${configurationModulePath}"...`
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

    context.logger.info('  ↳ Checking if using lazy loaded i18n...');
    if (hasConfigForLazyLoadingI18n(updatedContent)) {
      context.logger.info(
        '  ↳ i18n lazy loading has been detected. Updating the path from "../../assets" to "../../../public"'
      );

      if (updatedContent.includes('import(`../../assets/')) {
        updatedContent = updatedContent.replace(
          /import\(`\.\.\/\.\.\/assets\//g,
          'import(`../../../public/'
        );
      } else {
        printErrorWithDocs(
          '  ↳ No i18n configuration found that needs updating',
          context
        );
        return;
      }

      tree.overwrite(configurationModulePath, updatedContent);
      context.logger.info('✅ Updated i18n configuration');
    } else {
      context.logger.info(
        '  ↳ No i18n configuration found that needs updating'
      );
    }
  };
}

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
