/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaymentDetails } from '@spartacus/cart/base/root';
import {
  CheckoutPaymentFacade,
  CheckoutStepType,
} from '@spartacus/checkout/base/root';
import { TranslationService } from '@spartacus/core';
import { Card, ICON_TYPE } from '@spartacus/storefront';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CheckoutStepService } from '../../services/checkout-step.service';

@Component({
  selector: 'cx-checkout-review-payment',
  templateUrl: './checkout-review-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReviewPaymentComponent {
  iconTypes = ICON_TYPE;

  paymentDetailsStepRoute = this.checkoutStepService.getCheckoutStepRoute(
    CheckoutStepType.PAYMENT_DETAILS
  );

  constructor(
    protected checkoutStepService: CheckoutStepService,
    protected checkoutPaymentFacade: CheckoutPaymentFacade,
    protected translationService: TranslationService
  ) {}

  paymentDetails$: Observable<PaymentDetails | undefined> =
    this.checkoutPaymentFacade.getPaymentDetailsState().pipe(
      filter((state) => !state.loading && !state.error),
      map((state) => state.data)
    );

  getPaymentMethodCard(paymentDetails: PaymentDetails): Observable<Card> {
    return combineLatest([
      this.translationService.translate('paymentForm.payment'),
      this.translationService.translate('paymentCard.expires', {
        month: paymentDetails.expiryMonth,
        year: paymentDetails.expiryYear,
      }),
    ]).pipe(
      map(([textTitle, textExpires]) => {
        return {
          title: textTitle,
          text: [
            paymentDetails.cardType?.name,
            paymentDetails.accountHolderName,
            paymentDetails.cardNumber,
            textExpires,
          ],
        } as Card;
      })
    );
  }

  getBillingAddressCard(paymentDetails: PaymentDetails): Observable<Card> {
    return combineLatest([
      this.translationService.translate('paymentForm.billingAddress'),
      this.translationService.translate('addressCard.billTo'),
    ]).pipe(
      map(([billingAddress, billTo]) => {
        const region = paymentDetails.billingAddress?.region?.isocode
          ? paymentDetails.billingAddress?.region?.isocode + ', '
          : '';
        return {
          title: billingAddress,
          text: [
            billTo,
            paymentDetails.billingAddress?.firstName +
              ' ' +
              paymentDetails.billingAddress?.lastName,
            paymentDetails.billingAddress?.line1,
            paymentDetails.billingAddress?.town +
              ', ' +
              region +
              paymentDetails.billingAddress?.country?.isocode,
            paymentDetails.billingAddress?.postalCode,
          ],
        } as Card;
      })
    );
  }
}
