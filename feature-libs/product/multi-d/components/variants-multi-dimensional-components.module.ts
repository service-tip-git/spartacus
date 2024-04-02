/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { OrderGridModule } from './order-grid/order-grid.module';
import { VariantsMultiDimensionalModule } from './variants-multi-dimensional/variants-multi-dimensional.module';

@NgModule({
  imports: [VariantsMultiDimensionalModule, OrderGridModule],
})
export class VariantsMultiDimensionalComponentsModule {}
