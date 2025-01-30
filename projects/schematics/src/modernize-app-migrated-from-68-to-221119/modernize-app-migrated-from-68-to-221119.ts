/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Rule,
  SchematicContext,
  Tree,
  chain,
} from '@angular-devkit/schematics';

import { migrateToApplicationBuilder } from './migrate-to-application-builder';
import { updateTsConfig } from './update-ts-config';
import { migrateSSRConfig } from './migrate-ssr-config';
import { updatePackageJsonScripts } from './update-package-json-scripts';
import { updateTsConfigsForSsr } from './update-ts-configs-for-ssr';
import { renameAppServerModule } from './rename-app-server-module';
import { updateMainServerTs } from './update-main-server-ts';
import { updateServerTs } from './update-server-ts';
import { updateAppModule } from './update-app-module';

/**
 * Modernizes an application to use new Angular v17 standards.
 */
export function migrate(): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    context.logger.info(
      'Modernizing an app migrated from Angular 6.8 to 2211.19...'
    );

    return chain([
      migrateToApplicationBuilder,
      updateTsConfig,
      migrateSSRConfig,
      updatePackageJsonScripts,
      updateTsConfigsForSsr,
      renameAppServerModule,
      updateMainServerTs,
      updateServerTs,
      updateAppModule,
    ]);
  };
}
