/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActiveCartFacade, Cart } from '@spartacus/cart/base/root';
import { Observable } from 'rxjs';
import { NgIf, AsyncPipe } from '@angular/common';
import { PromotionsComponent } from '../../../../../../projects/storefrontlib/cms-components/misc/promotions/promotions.component';
import { TranslatePipe } from '@spartacus/core';
import { MockTranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-checkout-review-overview',
  templateUrl: './checkout-review-overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    PromotionsComponent,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class CheckoutReviewOverviewComponent {
  constructor(protected activeCartFacade: ActiveCartFacade) {}

  get cart$(): Observable<Cart> {
    return this.activeCartFacade.getActive();
  }
}
