/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CheckoutAuthGuard } from '@spartacus/checkout/base/components';
import {
  CmsConfig,
  provideDefaultConfig,
  provideDefaultConfigFactory,
} from '@spartacus/core';
import { defaultOpfCheckoutConfig } from './config/default-opf-checkout-config';
import { defaultOpfCheckoutRoutingConfig } from './config/default-opf-checkout-routing-config';
import { OPF_CHECKOUT_FEATURE } from './feature-name';
import { OpfCheckoutAuthGuard } from './сheckout-guard/opf-checkout-auth.guard';
import { CheckoutGuardService } from './сheckout-guard/сheckout-guard.service';

export const CHECKOUT_OPF_CMS_COMPONENTS: string[] = [
  'OpfCheckoutPaymentAndReview',
];

export function defaultOpfCheckoutComponentsConfig() {
  const config: CmsConfig = {
    featureModules: {
      [OPF_CHECKOUT_FEATURE]: {
        cmsComponents: CHECKOUT_OPF_CMS_COMPONENTS,
      },
    },
  };
  return config;
}

@NgModule({
  providers: [
    {
      provide: CheckoutAuthGuard,
      useClass: OpfCheckoutAuthGuard,
    },
    provideDefaultConfig(defaultOpfCheckoutRoutingConfig),
    provideDefaultConfig(defaultOpfCheckoutConfig),
    provideDefaultConfigFactory(defaultOpfCheckoutComponentsConfig),
  ],
})
export class OpfCheckoutRootModule {}
