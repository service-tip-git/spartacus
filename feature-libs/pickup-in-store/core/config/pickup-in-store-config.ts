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
export abstract class PickupInStoreConfig {
  pickupInStore?: {
    consentTemplateId?: string;
  };
}

declare module '@spartacus/core' {
  interface Config extends PickupInStoreConfig {}
}
