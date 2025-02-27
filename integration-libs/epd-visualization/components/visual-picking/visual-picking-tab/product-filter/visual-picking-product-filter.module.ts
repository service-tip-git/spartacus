/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18nModule, UrlModule } from '@spartacus/core';
import { IconModule } from '@spartacus/storefront';
import { VisualPickingProductFilterComponent } from './visual-picking-product-filter.component';
import { VisualPickingProductFilterService } from './visual-picking-product-filter.service';

@NgModule({
  imports: [CommonModule, FormsModule, IconModule, UrlModule, I18nModule],
  providers: [VisualPickingProductFilterService],
  declarations: [VisualPickingProductFilterComponent],
  exports: [VisualPickingProductFilterComponent],
})
export class VisualPickingProductFilterModule {}
