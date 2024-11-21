/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AddToCartComponent } from '@spartacus/cart/base/components/add-to-cart';
import { TranslatePipe } from '@spartacus/core';
import { IconComponent } from '@spartacus/storefront';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'cx-epd-visualization-compact-add-to-cart',
  templateUrl: './compact-add-to-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    IconComponent,
    TranslatePipe,
  ],
})
export class CompactAddToCartComponent extends AddToCartComponent {}
