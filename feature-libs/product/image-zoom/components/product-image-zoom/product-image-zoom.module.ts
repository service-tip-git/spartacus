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
} from '@spartacus/core';
import {
  CarouselModule,
  IconModule,
  KeyboardFocusModule,
  MediaModule,
  OutletModule,
} from '@spartacus/storefront';
import { defaultProductImageZoomLayoutConfig } from './default-product-image-zoom-layout.config';
import { ProductImageZoomDialogComponent } from './product-image-zoom-dialog/product-image-zoom-dialog.component';
import { ProductImageZoomProductImagesComponent } from './product-image-zoom-product-images/product-image-zoom-product-images.component';
import { ProductImageZoomThumbnailsComponent } from './product-image-zoom-thumbnails/product-image-zoom-thumbnails.component';
import { ProductImageZoomTriggerComponent } from './product-image-zoom-trigger/product-image-zoom-trigger.component';
import { ProductImageZoomViewComponent } from './product-image-zoom-view/product-image-zoom-view.component';

@NgModule({
  imports: [
    CarouselModule,
    CommonModule,
    I18nModule,
    IconModule,
    KeyboardFocusModule,
    MediaModule,
    OutletModule,
    RouterModule,
    FeaturesConfigModule,
  ],
  providers: [
    provideDefaultConfig(defaultProductImageZoomLayoutConfig),
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        ProductImagesComponent: {
          component: ProductImageZoomProductImagesComponent,
        },
      },
    }),
  ],
  declarations: [
    ProductImageZoomDialogComponent,
    ProductImageZoomProductImagesComponent,
    ProductImageZoomThumbnailsComponent,
    ProductImageZoomTriggerComponent,
    ProductImageZoomViewComponent,
  ],
  exports: [
    ProductImageZoomDialogComponent,
    ProductImageZoomProductImagesComponent,
    ProductImageZoomThumbnailsComponent,
    ProductImageZoomTriggerComponent,
    ProductImageZoomViewComponent,
  ],
})
export class ProductImageZoomModule {}
