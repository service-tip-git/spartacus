/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActiveCartFacade, DeliveryMode } from '@spartacus/cart/base/root';
import { B2BCheckoutReviewSubmitComponent } from '@spartacus/checkout/b2b/components';
import {
  CheckoutCostCenterFacade,
  CheckoutPaymentTypeFacade,
} from '@spartacus/checkout/b2b/root';
import { CheckoutStepService } from '@spartacus/checkout/base/components';
import {
  CheckoutDeliveryAddressFacade,
  CheckoutDeliveryModesFacade,
  CheckoutPaymentFacade,
  CheckoutStepType,
} from '@spartacus/checkout/base/root';
import { TranslationService, UserCostCenterService } from '@spartacus/core';
import { Card } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  CheckoutServiceDetailsFacade,
  CheckoutServiceSchedulePickerService,
  ServiceDateTime,
  S4ServiceDeliveryModeConfig,
} from '@spartacus/s4-service/root';
import { NgIf, NgFor, NgSwitch, NgSwitchCase, NgTemplateOutlet, NgClass, AsyncPipe } from '@angular/common';
import { CardComponent } from '../../../../../projects/storefrontlib/shared/components/card/card.component';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { OutletDirective } from '../../../../../projects/storefrontlib/cms-structure/outlet/outlet.directive';
import { PromotionsComponent } from '../../../../../projects/storefrontlib/cms-components/misc/promotions/promotions.component';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { UrlPipe } from '../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';

@Component({
    selector: 'cx-review-submit',
    templateUrl: './service-checkout-review-submit.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgIf,
        NgFor,
        NgSwitch,
        NgSwitchCase,
        NgTemplateOutlet,
        NgClass,
        CardComponent,
        RouterLink,
        IconComponent,
        OutletDirective,
        PromotionsComponent,
        AsyncPipe,
        TranslatePipe,
        UrlPipe,
        MockTranslatePipe,
    ],
})
export class ServiceCheckoutReviewSubmitComponent extends B2BCheckoutReviewSubmitComponent {
  checkoutStepTypeServiceDetails = CheckoutStepType.SERVICE_DETAILS;
  protected checkoutServiceDetailsFacade = inject(CheckoutServiceDetailsFacade);
  protected checkoutServiceSchedulePickerService = inject(
    CheckoutServiceSchedulePickerService
  );
  protected config = inject(S4ServiceDeliveryModeConfig);

  constructor(
    protected checkoutDeliveryAddressFacade: CheckoutDeliveryAddressFacade,
    protected checkoutPaymentFacade: CheckoutPaymentFacade,
    protected activeCartFacade: ActiveCartFacade,
    protected translationService: TranslationService,
    protected checkoutStepService: CheckoutStepService,
    protected checkoutDeliveryModesFacade: CheckoutDeliveryModesFacade,
    protected checkoutPaymentTypeFacade: CheckoutPaymentTypeFacade,
    protected checkoutCostCenterFacade: CheckoutCostCenterFacade,
    protected userCostCenterService: UserCostCenterService
  ) {
    super(
      checkoutDeliveryAddressFacade,
      checkoutPaymentFacade,
      activeCartFacade,
      translationService,
      checkoutStepService,
      checkoutDeliveryModesFacade,
      checkoutPaymentTypeFacade,
      checkoutCostCenterFacade,
      userCostCenterService
    );
  }

  get scheduledAt$(): Observable<string | undefined> {
    return this.checkoutServiceDetailsFacade
      .getSelectedServiceDetailsState()
      .pipe(
        filter((state) => !state.loading && !state.error),
        map((state) => {
          return state.data;
        })
      );
  }
  protected getCheckoutDeliverySteps(): Array<CheckoutStepType | string> {
    return [
      CheckoutStepType.DELIVERY_ADDRESS,
      CheckoutStepType.DELIVERY_MODE,
      CheckoutStepType.SERVICE_DETAILS,
    ];
  }

  shouldShowDeliveryModeCard(mode: DeliveryMode): boolean {
    return mode.code !== this.config.s4ServiceDeliveryMode?.code;
  }

  getServiceDetailsCard(
    scheduledAt: ServiceDateTime | undefined | null
  ): Observable<Card> {
    return this.translationService
      .translate('serviceOrderCheckout.serviceDetails')
      .pipe(
        map((textTitle) => {
          if (scheduledAt) {
            scheduledAt =
              this.checkoutServiceSchedulePickerService.convertDateTimeToReadableString(
                scheduledAt
              );
          }
          return {
            title: textTitle,
            textBold: scheduledAt?.split(',')[0] ?? '',
            text: [scheduledAt?.split(',')[1].trim() ?? ''],
          };
        })
      );
  }
}
