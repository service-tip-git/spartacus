/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActiveCartFacade, Cart, PaymentType } from '@spartacus/cart/base/root';
import {
  CheckoutReviewSubmitComponent,
  CheckoutStepService,
} from '@spartacus/checkout/base/components';
import {
  CheckoutDeliveryAddressFacade,
  CheckoutDeliveryModesFacade,
  CheckoutPaymentFacade,
} from '@spartacus/checkout/base/root';
import { CmsService, Page, TranslationService } from '@spartacus/core';
import { OpfMetadataStoreService } from '@spartacus/opf/base/root';
import { OPF_EXPLICIT_TERMS_AND_CONDITIONS_COMPONENT } from '@spartacus/opf/checkout/root';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cx-opf-checkout-payment-and-review',
  templateUrl: './opf-checkout-payment-and-review.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpfCheckoutPaymentAndReviewComponent
  extends CheckoutReviewSubmitComponent
  implements OnInit
{
  protected defaultTermsAndConditionsFieldValue = false;
  protected cmsService = inject(CmsService);

  explicitTermsAndConditions$: Observable<boolean | undefined> = this.cmsService
    .getCurrentPage()
    .pipe(
      map((page: Page) => {
        return this.isCmsComponentInPage(
          OPF_EXPLICIT_TERMS_AND_CONDITIONS_COMPONENT,
          page
        );
      })
    );

  checkoutSubmitForm: UntypedFormGroup = this.fb.group({
    termsAndConditions: [
      this.defaultTermsAndConditionsFieldValue,
      Validators.requiredTrue,
    ],
  });

  get termsAndConditionInvalid(): boolean {
    return this.checkoutSubmitForm.invalid;
  }

  get termsAndConditionsFieldValue(): boolean {
    return Boolean(this.checkoutSubmitForm.get('termsAndConditions')?.value);
  }

  get paymentType$(): Observable<PaymentType | undefined> {
    return this.activeCartFacade
      .getActive()
      .pipe(map((cart: Cart) => cart.paymentType));
  }

  constructor(
    protected fb: UntypedFormBuilder,
    protected checkoutDeliveryAddressFacade: CheckoutDeliveryAddressFacade,
    protected checkoutPaymentFacade: CheckoutPaymentFacade,
    protected activeCartFacade: ActiveCartFacade,
    protected translationService: TranslationService,
    protected checkoutStepService: CheckoutStepService,
    protected checkoutDeliveryModesFacade: CheckoutDeliveryModesFacade,
    protected opfMetadataStoreService: OpfMetadataStoreService
  ) {
    super(
      checkoutDeliveryAddressFacade,
      checkoutPaymentFacade,
      activeCartFacade,
      translationService,
      checkoutStepService,
      checkoutDeliveryModesFacade
    );
  }

  protected isCmsComponentInPage(cmsComponentUid: string, page: Page): boolean {
    return !!page && JSON.stringify(page).includes(cmsComponentUid);
  }

  protected updateTermsAndConditionsState() {
    this.opfMetadataStoreService.updateOpfMetadata({
      termsAndConditionsChecked: this.termsAndConditionsFieldValue,
    });
  }

  toggleTermsAndConditions() {
    this.updateTermsAndConditionsState();
  }

  ngOnInit() {
    this.updateTermsAndConditionsState();
  }
}
