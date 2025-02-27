/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Config } from '../../config/config-tokens';

export enum StorageSyncType {
  NO_STORAGE = 'NO_STORAGE',
  LOCAL_STORAGE = 'LOCAL_STORAGE',
  SESSION_STORAGE = 'SESSION_STORAGE',
}

export enum StateTransferType {
  TRANSFER_STATE = 'SSR',
}

@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class StateConfig {
  state?: {
    ssrTransfer?: {
      keys?: {
        /**
         * A set of state keys that should be transferred from server.
         */
        [key: string]: StateTransferType | undefined;
      };
    };
  };
}

declare module '../../config/config-tokens' {
  interface Config extends StateConfig {}
}
