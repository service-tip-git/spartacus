/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConfiguratorCoreConfig } from './configurator-core.config';

export const defaultConfiguratorCoreConfig: ConfiguratorCoreConfig = {
  productConfigurator: {
    enableVariantSearch: false,
    cpqOverOcc: false,
  },
};
