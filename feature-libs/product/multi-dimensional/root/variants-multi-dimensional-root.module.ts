/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { provideDefaultConfigFactory } from '@spartacus/core';
import { PRODUCT_MULTIDIMENSIONAL_FEATURE } from './feature-name';
import { ProductMultidimensionalIconsComponent } from './components/multidimensional-icons/product-multidimensional-icons.component';
import {
  OutletPosition,
  ProductListOutlets,
  provideOutlet,
} from '@spartacus/storefront';
import { ProductMultidimensionalIconsModule } from './components/multidimensional-icons/product-multidimensional-icons.module';

export function defaultProductMultiDimensionalComponentsConfig() {
  const config = {
    featureModules: {
      [PRODUCT_MULTIDIMENSIONAL_FEATURE]: {
        cmsComponents: [
          'ProductVariantSelectorComponent', // mock trigger
          'ProductVariantMultiDimensionalSelectorComponent',
        ],
      },
    },
  };
  return config;
}

@NgModule({
  imports: [ProductMultidimensionalIconsModule],
  providers: [
    provideDefaultConfigFactory(defaultProductMultiDimensionalComponentsConfig),
    provideOutlet({
      id: ProductListOutlets.ITEM_DETAILS,
      position: OutletPosition.AFTER,
      component: ProductMultidimensionalIconsComponent,
    }),
  ],
})
export class VariantsMultiDimensionalRootModule {}
