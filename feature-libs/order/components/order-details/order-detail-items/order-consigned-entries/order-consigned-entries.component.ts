/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, Input } from '@angular/core';
import {
  AbstractOrderType,
  CartOutlets,
  PromotionLocation,
} from '@spartacus/cart/base/root';
import { Consignment, Order, OrderOutlets } from '@spartacus/order/root';
import { NgFor, NgIf } from '@angular/common';
import { OutletDirective } from '../../../../../../projects/storefrontlib/cms-structure/outlet/outlet.directive';
import { FeatureDirective } from '../../../../../../projects/core/src/features-config/directives/feature.directive';
import { ConsignmentTrackingComponent } from '../consignment-tracking/consignment-tracking.component';
import { AbstractOrderContextDirective } from '../../../../../cart/base/components/abstract-order-context/abstract-order-context.directive';
import { AddToCartComponent } from '../../../../../cart/base/components/add-to-cart/add-to-cart.component';
import { TranslatePipe } from '../../../../../../projects/core/src/i18n/translate.pipe';
import { CxDatePipe } from '../../../../../../projects/core/src/i18n/date.pipe';
import { MockTranslatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { MockDatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-date.pipe';

@Component({
    selector: 'cx-order-consigned-entries',
    templateUrl: './order-consigned-entries.component.html',
    imports: [
        NgFor,
        OutletDirective,
        NgIf,
        FeatureDirective,
        ConsignmentTrackingComponent,
        AbstractOrderContextDirective,
        AddToCartComponent,
        TranslatePipe,
        CxDatePipe,
        MockTranslatePipe,
        MockDatePipe,
    ],
})
export class OrderConsignedEntriesComponent {
  @Input() consignments: Consignment[];
  @Input() order: Order;
  @Input() enableAddToCart: boolean | undefined;
  @Input() buyItAgainTranslation: string;

  promotionLocation: PromotionLocation = PromotionLocation.Order;

  readonly OrderOutlets = OrderOutlets;
  readonly CartOutlets = CartOutlets;
  readonly abstractOrderType = AbstractOrderType;
}
