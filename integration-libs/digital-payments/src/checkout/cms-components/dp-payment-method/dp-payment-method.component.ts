/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActiveCartFacade } from '@spartacus/cart/base/root';
import {
  CheckoutPaymentMethodComponent as CorePaymentMethodComponent,
  CheckoutStepService,
} from '@spartacus/checkout/base/components';
import {
  CheckoutDeliveryAddressService,
  CheckoutPaymentService,
} from '@spartacus/checkout/base/core';
import {
  GlobalMessageService,
  PaymentDetails,
  TranslationService,
  UserPaymentService,
} from '@spartacus/core';
import { DP_CARD_REGISTRATION_STATUS } from '../../../utils/dp-constants';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FeatureDirective } from '../../../../../../projects/core/src/features-config/directives/feature.directive';
import { CardComponent } from '../../../../../../projects/storefrontlib/shared/components/card/card.component';
import { DpPaymentFormComponent } from './dp-payment-form/dp-payment-form.component';
import { SpinnerComponent } from '../../../../../../projects/storefrontlib/shared/components/spinner/spinner.component';
import { DpPaymentCallbackComponent } from './dp-payment-callback/dp-payment-callback.component';
import { TranslatePipe } from '../../../../../../projects/core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';

@Component({
  selector: 'cx-payment-method',
  templateUrl: './dp-payment-method.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    FeatureDirective,
    NgFor,
    CardComponent,
    DpPaymentFormComponent,
    SpinnerComponent,
    DpPaymentCallbackComponent,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class DpPaymentMethodComponent extends CorePaymentMethodComponent {
  showCallbackScreen = false;

  isDpCallback(): boolean {
    const queryParams = this.activatedRoute.snapshot.queryParamMap.get(
      DP_CARD_REGISTRATION_STATUS
    );

    return !!queryParams;
  }

  hideCallbackScreen(): void {
    this.showCallbackScreen = false;
  }

  paymentDetailsAdded(paymentDetails: PaymentDetails) {
    this.savePaymentMethod(paymentDetails);
    this.next();
  }

  // TODO:#checkout - handle breaking changes
  constructor(
    protected userPaymentService: UserPaymentService,
    protected checkoutDeliveryAddressFacade: CheckoutDeliveryAddressService,
    protected checkoutPaymentFacade: CheckoutPaymentService,
    protected activatedRoute: ActivatedRoute,
    protected translationService: TranslationService,
    protected activeCartFacade: ActiveCartFacade,
    protected checkoutStepService: CheckoutStepService,
    protected globalMessageService: GlobalMessageService
  ) {
    super(
      userPaymentService,
      checkoutDeliveryAddressFacade,
      checkoutPaymentFacade,
      activatedRoute,
      translationService,
      activeCartFacade,
      checkoutStepService,
      globalMessageService
    );

    this.showCallbackScreen = this.isDpCallback();
  }
}
