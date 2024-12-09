/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, inject, Input, OnInit } from '@angular/core';
import {
  AbstractOrderType,
  CartOutlets,
  PromotionLocation,
} from '@spartacus/cart/base/root';
import { FeatureConfigService } from '@spartacus/core';
import { Consignment, Order, OrderOutlets } from '@spartacus/order/root';
import { OrderConsignmentService } from '@spartacus/order/core';

@Component({
  selector: 'cx-order-consigned-entries',
  templateUrl: './order-consigned-entries.component.html',
})
export class OrderConsignedEntriesComponent implements OnInit{
  private featureConfig = inject(FeatureConfigService);

  @Input() consignments: Consignment[];
  @Input() order: Order;
  @Input() enableAddToCart: boolean | undefined;
  @Input() buyItAgainTranslation: string;

  promotionLocation: PromotionLocation = PromotionLocation.Order;

  readonly OrderOutlets = OrderOutlets;
  readonly CartOutlets = CartOutlets;
  readonly abstractOrderType = AbstractOrderType;

  constructor(
    protected orderConsignmentService: OrderConsignmentService,
  ) {}

  ngOnInit() {
    if (this.featureConfig.isEnabled('enableBundles')) {
      this.consignments =
        this.orderConsignmentService.assignEntryGroupsToConsignments(this.order, this.consignments);
    }
  }
}
