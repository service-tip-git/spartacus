/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FeatureConfigService, Product, ProductScope } from '@spartacus/core';
import { Observable } from 'rxjs';
import { CurrentProductService } from '../current-product.service';
import { ProductDetailOutlets } from '../product-outlets.model';
import { TranslatePipe } from '@spartacus/core';
import { OutletDirective } from '../../../cms-structure/outlet/outlet.directive';
import { PromotionsComponent } from '../../misc/promotions/promotions.component';
import { FeatureDirective } from '@spartacus/core';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-product-summary',
  templateUrl: './product-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    FeatureDirective,
    PromotionsComponent,
    OutletDirective,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class ProductSummaryComponent {
  private featureConfig = inject(FeatureConfigService);

  outlets = ProductDetailOutlets;

  product$: Observable<Product | null> = this.getProduct();

  protected getProduct(): Observable<Product | null> {
    const productScopes = [ProductScope.DETAILS, ProductScope.PRICE];
    if (this.featureConfig.isEnabled('showPromotionsInPDP')) {
      productScopes.push(ProductScope.PROMOTIONS);
    }
    return this.currentProductService.getProduct(productScopes);
  }

  constructor(protected currentProductService: CurrentProductService) {}
}
