/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import {
  LOCATION_INITIALIZED_MULTI,
  provideDefaultConfig,
} from '@spartacus/core';
import { oppsInterceptors } from './http-interceptors';
import { defaultOppsConfig } from '../config';
import { OppsCouponCodesService } from './opps-coupon-codes.service';

export function saveCouponCodesFactory(
  service: OppsCouponCodesService
): () => void {
  return () => {
    service.saveUrlCouponCodes();
  };
}

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    ...oppsInterceptors,
    provideDefaultConfig(defaultOppsConfig),
    OppsCouponCodesService,
    {
      provide: LOCATION_INITIALIZED_MULTI,
      useFactory: saveCouponCodesFactory,
      deps: [OppsCouponCodesService],
      multi: true,
    },
  ],
})
export class OppsCouponCodesModule {}
