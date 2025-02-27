/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Config } from '@spartacus/core';

@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class PWAModuleConfig {
  pwa?: {
    enabled?: boolean;
    addToHomeScreen?: boolean;
  };
}

export const defaultPWAModuleConfig: PWAModuleConfig = {
  pwa: {
    enabled: false,
    addToHomeScreen: false,
  },
};

declare module '@spartacus/core' {
  interface Config extends PWAModuleConfig {}
}
