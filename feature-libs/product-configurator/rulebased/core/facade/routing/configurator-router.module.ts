/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { ConfiguratorRouterListener } from './configurator-router.listener';

@NgModule({})
export class ConfiguratorRouterModule {
  constructor(_configuratorRouterListener: ConfiguratorRouterListener) {
    // Intentional empty constructor
  }
}
