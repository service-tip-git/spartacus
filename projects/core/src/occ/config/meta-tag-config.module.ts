/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { provideConfigFromMetaTags } from './config-from-meta-tag-factory';

@NgModule({})
export class MetaTagConfigModule {
  static forRoot(): ModuleWithProviders<MetaTagConfigModule> {
    return {
      ngModule: MetaTagConfigModule,
      providers: [...provideConfigFromMetaTags()],
    };
  }
}
