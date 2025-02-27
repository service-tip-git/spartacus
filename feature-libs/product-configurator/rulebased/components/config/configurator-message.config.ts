/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductConfiguratorMessageConfig {
  updateConfigurationMessage?: {
    waitingTime?: number;
  };
}

export abstract class ConfiguratorMessageConfig {
  productConfigurator?: ProductConfiguratorMessageConfig;
}
