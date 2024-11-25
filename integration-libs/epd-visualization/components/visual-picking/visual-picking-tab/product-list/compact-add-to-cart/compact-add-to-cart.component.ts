/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AddToCartComponent } from '@spartacus/cart/base/components/add-to-cart';
import { NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '@spartacus/storefront';

@Component({
  selector: 'cx-epd-visualization-compact-add-to-cart',
  templateUrl: './compact-add-to-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, FormsModule, ReactiveFormsModule, IconComponent],
})
export class CompactAddToCartComponent extends AddToCartComponent {}
