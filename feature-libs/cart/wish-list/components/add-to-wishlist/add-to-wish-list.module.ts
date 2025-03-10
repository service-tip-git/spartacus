/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  FeaturesConfigModule,
  I18nModule,
  provideDefaultConfig,
  UrlModule,
} from '@spartacus/core';
import {
  AtMessageModule,
  BtnLikeLinkModule,
  IconModule,
} from '@spartacus/storefront';
import { AddToWishListComponent } from './add-to-wish-list.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    IconModule,
    RouterModule,
    UrlModule,
    AtMessageModule,
    FeaturesConfigModule,
    BtnLikeLinkModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        AddToWishListComponent: {
          component: AddToWishListComponent,
        },
      },
    }),
  ],
  declarations: [AddToWishListComponent],
  exports: [AddToWishListComponent],
})
export class AddToWishListModule {}
