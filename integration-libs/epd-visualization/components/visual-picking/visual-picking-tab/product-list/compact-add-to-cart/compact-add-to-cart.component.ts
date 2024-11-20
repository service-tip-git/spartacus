/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AddToCartComponent } from '@spartacus/cart/base/components/add-to-cart';
import { MockTranslatePipe } from '../../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../../../projects/core/src/i18n/translate.pipe';
import { IconComponent } from '../../../../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
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
    MockTranslatePipe,
  ],
})
export class CompactAddToCartComponent extends AddToCartComponent {}
