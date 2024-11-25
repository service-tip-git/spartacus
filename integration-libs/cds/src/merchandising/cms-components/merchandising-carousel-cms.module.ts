/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CmsConfig, provideDefaultConfig, UrlModule } from '@spartacus/core';
import { CarouselModule, MediaModule } from '@spartacus/storefront';
import { AttributesModule } from './directives/attributes/attributes.module';
import { MerchandisingCarouselComponent } from './merchandising-carousel/merchandising-carousel.component';

@NgModule({
  imports: [
    CommonModule,
    AttributesModule,
    CarouselModule,
    MediaModule,
    RouterModule,
    UrlModule,
    MerchandisingCarouselComponent,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        MerchandisingCarouselComponent: {
          component: MerchandisingCarouselComponent,
        },
      },
    }),
  ],
  exports: [MerchandisingCarouselComponent],
})
export class MerchandisingCarouselCmsModule {}
