/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Config } from '@spartacus/core';
import { OpfQuickBuyProvider } from '../model';

@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class OpfQuickBuyConfig {
  providers?: OpfQuickBuyProvider[] | undefined;
}

declare module '@spartacus/core' {
  interface Config extends OpfQuickBuyConfig {}
}
