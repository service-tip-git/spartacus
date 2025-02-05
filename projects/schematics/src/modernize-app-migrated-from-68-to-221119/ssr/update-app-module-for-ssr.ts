/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Rule } from '@angular-devkit/schematics';
import { printErrorWithAdviceToFollowDocs } from '../fallback-advice-to-follow-docs';
export function updateAppModuleForSsr(): Rule {
  return (tree, context) => {
    const appModulePath = 'src/app/app.module.ts';
    context.logger.info(`\n⏳ Updating ${appModulePath} for SSR...`);

    if (!tree.exists(appModulePath)) {
      printErrorWithAdviceToFollowDocs(
        `Could not find ${appModulePath}`,
        context
      );
      return;
    }

    const content = tree.read(appModulePath);
    if (!content) {
      return;
    }

    let updatedContent = content.toString();

    // For SSR apps, update BrowserModule
    updatedContent = updatedContent.replace(
      /BrowserModule\.withServerTransition\(\s*{\s*appId:\s*['"]serverApp['"]\s*}\s*\)/,
      'BrowserModule'
    );

    tree.overwrite(appModulePath, updatedContent);

    context.logger.info(`✅ Updated ${appModulePath} for SSR`);
  };
}
