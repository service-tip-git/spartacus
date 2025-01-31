/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Config } from '@spartacus/core';

interface CpqConfiguratorBackendConfig {
  cpq?: {
    endpoints: {
      configurationInit: string;
      configurationDisplay: string;
      attributeUpdate: string;
      valueUpdate: string;
    };
    prefix: string;
  };
}

@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class CpqConfiguratorEndpointConfig {
  backend?: CpqConfiguratorBackendConfig;
}

declare module '@spartacus/core' {
  interface BackendConfig extends CpqConfiguratorBackendConfig {}
}
