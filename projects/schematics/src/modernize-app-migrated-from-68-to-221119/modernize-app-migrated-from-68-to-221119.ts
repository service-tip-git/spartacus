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

import { updateAngularJsonForApplicationBuilder } from './csr-and-ssr/update-angular-json-for-application-builder';
import { updateTsConfig } from './csr-and-ssr/update-ts-config';
import { updateAngularJsonForSsr } from './ssr/update-angular-json-for-ssr';
import { updateTsConfigApp } from './ssr/update-ts-config-app';
import { renameAppServerModule } from './ssr/rename-app-server-module';
import { updateMainServerTs } from './ssr/update-main-server-ts';
import { updateServerTs } from './ssr/update-server-ts/update-server-ts';
import { updateAppModule } from './csr-and-ssr/update-app-module';
import { updatePackageJsonServerScripts } from './ssr/update-package-json-server-scripts';
import { isUsingOldServerBuilder } from './is-using-old-server-builder';
import { removeTsConfigServer } from './ssr/remove-ts-config-server';
import { withFallbackToShowingDocs } from './with-fallback-to-showing-docs';

/**
 * Modernizes an application to use new Angular v17 standards.
 */
export function migrate(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return chain([
      withFallbackToShowingDocs(updateAngularJsonForApplicationBuilder()),
      withFallbackToShowingDocs(updateTsConfig()),
      withFallbackToShowingDocs(updateAppModule()),

      ...(isUsingOldServerBuilder(tree, context)
        ? [
            withFallbackToShowingDocs(updateAngularJsonForSsr()),
            withFallbackToShowingDocs(updatePackageJsonServerScripts()),
            withFallbackToShowingDocs(updateTsConfigApp()),
            withFallbackToShowingDocs(removeTsConfigServer()),
            withFallbackToShowingDocs(renameAppServerModule()),
            withFallbackToShowingDocs(updateMainServerTs()),
            withFallbackToShowingDocs(updateServerTs()),
          ]
        : []),
    ]);
  };
}
