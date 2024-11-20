/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CartValidationFacade } from '@spartacus/cart/base/root';
import { ICON_TYPE } from '@spartacus/storefront';
import { map } from 'rxjs/operators';
import { MockTranslatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../../projects/core/src/i18n/translate.pipe';
import { IconComponent } from '../../../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-cart-item-validation-warning',
  templateUrl: './cart-item-validation-warning.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, IconComponent, AsyncPipe, TranslatePipe, MockTranslatePipe],
})
export class CartItemValidationWarningComponent {
  @Input()
  code: string;

  iconTypes = ICON_TYPE;
  isVisible = true;

  cartModification$ = this.cartValidationFacade
    .getValidationResults()
    .pipe(
      map((modificationList) =>
        modificationList.find(
          (modification) => modification.entry?.product?.code === this.code
        )
      )
    );

  constructor(protected cartValidationFacade: CartValidationFacade) {}
}
