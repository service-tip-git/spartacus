/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CartEventBuilder } from './cart-event.builder';

@NgModule({})
export class CartEventModule {
  constructor(_CartEventBuilder: CartEventBuilder) {
    // Intentional empty constructor
  }
}
