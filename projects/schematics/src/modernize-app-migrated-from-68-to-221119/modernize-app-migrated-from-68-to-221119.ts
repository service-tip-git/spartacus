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

import { updateAngularJsonForApplicationBuilder } from './update-angular-json-for-application-builder';
import { updateTsConfig } from './update-ts-config';
import { updateAngularJsonForSsr } from './update-angular-json-for-ssr';
import { updateTsConfigApp } from './update-ts-config-app';
import { renameAppServerModule } from './rename-app-server-module';
import { updateMainServerTs } from './update-main-server-ts';
import { updateServerTs } from './update-server-ts';
import { updateAppModule } from './update-app-module';
import { updatePackageJsonServerScripts } from './update-package-json-server-scripts';
import { isUsingOldServerBuilder } from './is-using-old-server-builder';
import { withFallbackToManualMigrationDocs } from './fallback-to-manual-migration-docs';
import { removeTsConfigServer } from './remove-ts-config-server';

/**
 * Modernizes an application to use new Angular v17 standards.
 */
export function migrate(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return chain([
      withFallbackToManualMigrationDocs(
        updateAngularJsonForApplicationBuilder()
      ),
      withFallbackToManualMigrationDocs(updateTsConfig()),
      withFallbackToManualMigrationDocs(updateAppModule()),

      ...(isUsingOldServerBuilder(tree, context)
        ? [
            withFallbackToManualMigrationDocs(updateAngularJsonForSsr()),
            withFallbackToManualMigrationDocs(updatePackageJsonServerScripts()),
            withFallbackToManualMigrationDocs(updateTsConfigApp()),
            withFallbackToManualMigrationDocs(removeTsConfigServer()),
            withFallbackToManualMigrationDocs(renameAppServerModule()),
            withFallbackToManualMigrationDocs(updateMainServerTs()),
            withFallbackToManualMigrationDocs(updateServerTs()),
          ]
        : []),
    ]);
  };
}
