/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UrlModule, I18nModule } from '@spartacus/core';
import { ProductVariantStyleIconsComponent } from './product-variant-style-icons.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule, UrlModule, I18nModule],
  declarations: [ProductVariantStyleIconsComponent],
  exports: [ProductVariantStyleIconsComponent],
})
export class ProductVariantStyleIconsModule {}
