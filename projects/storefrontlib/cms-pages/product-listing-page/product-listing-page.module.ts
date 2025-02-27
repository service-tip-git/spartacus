/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideDefaultConfig, RoutingConfig } from '@spartacus/core';
import { CmsPageGuard, PageLayoutComponent } from '../../cms-structure/index';
import { PRODUCT_LISTING_URL_MATCHER } from './product-listing-url-matcher';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        // @ts-ignore
        path: null,
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent,
        data: { pageLabel: 'search', cxRoute: 'search' },
      },
      {
        // @ts-ignore
        path: null,
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent,
        data: { cxRoute: 'brand' },
      },
      {
        // The 'category' route  may include a greedy suffix url matcher '**/c/:categoryCode'
        // So not to shadow the specific 'brand' route, the 'category' is the last route in the sequence.
        // @ts-ignore
        path: null,
        canActivate: [CmsPageGuard],
        component: PageLayoutComponent,
        data: { cxRoute: 'category' },
      },
    ]),
  ],
  providers: [
    provideDefaultConfig(<RoutingConfig>{
      routing: {
        routes: {
          category: {
            matchers: [PRODUCT_LISTING_URL_MATCHER],
          },
        },
      },
    }),
  ],
})
export class ProductListingPageModule {}
