/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideDefaultConfig } from '@spartacus/core';
import { defaultOccProductVariantsMultidimensionalConfig } from './config/default-occ-variants-multidimensional-config';

@NgModule({
  imports: [CommonModule],
  providers: [
    provideDefaultConfig(defaultOccProductVariantsMultidimensionalConfig),
  ],
})
export class VariantsMultiDimensionalOccModule {}
