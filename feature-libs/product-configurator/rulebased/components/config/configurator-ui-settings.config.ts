/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Config } from '@spartacus/core';

export interface ProductConfiguratorUISettingsConfig {
  updateDebounceTime?: {
    quantity?: number;
    input?: number;
    date?: number;
  };
  addRetractOption?: boolean;
  enableNavigationToConflict?: boolean;
  descriptions?: {
    attributeDescriptionLength?: number;
    valueDescriptionLength?: number;
  };
}

@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class ConfiguratorUISettingsConfig {
  productConfigurator?: ProductConfiguratorUISettingsConfig;
}
