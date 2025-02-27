/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { provideDefaultConfig } from '@spartacus/core';
import { defaultOccBulkPricingConfig } from './config/default-occ-bulk-pricing-config';

@NgModule({
  imports: [CommonModule],
  providers: [provideDefaultConfig(defaultOccBulkPricingConfig)],
})
export class BulkPricingOccModule {}
