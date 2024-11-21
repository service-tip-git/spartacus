/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  CurrentProductService,
  ProductImagesComponent,
} from '@spartacus/storefront';
import { Product } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { FocusableCarouselItemDirective } from '@spartacus/storefront';
import { FeatureDirective } from '@spartacus/core';
import { CarouselComponent } from '@spartacus/storefront';
import { ProductImageZoomTriggerComponent } from '../product-image-zoom-trigger/product-image-zoom-trigger.component';
import { MediaComponent } from '@spartacus/storefront';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-product-images',
  templateUrl: './product-image-zoom-product-images.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    MediaComponent,
    ProductImageZoomTriggerComponent,
    CarouselComponent,
    FeatureDirective,
    FocusableCarouselItemDirective,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class ProductImageZoomProductImagesComponent extends ProductImagesComponent {
  expandImage = new BehaviorSubject(false);
  selectedIndex: number | undefined;

  product$: Observable<Product> = this.product$;

  constructor(protected currentProductService: CurrentProductService) {
    super(currentProductService);
  }

  openImage(item: any): void {
    this.mainMediaContainer.next(item);
    this.selectedIndex = this.mainMediaContainer.value?.zoom?.galleryIndex;
  }

  /**
   * Opens image zoom dialog.
   */
  triggerZoom(value: boolean): void {
    this.expandImage.next(value);
  }
}
