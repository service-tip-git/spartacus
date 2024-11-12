/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, inject, Input, OnInit } from '@angular/core';
import {
  AbstractOrderType,
  CartOutlets,
  ConsignmentEntry,
  OrderEntry,
  OrderEntryGroup,
  PromotionLocation,
} from '@spartacus/cart/base/root';
import { FeatureConfigService } from '@spartacus/core';
import { Consignment, Order, OrderOutlets } from '@spartacus/order/root';
import { OrderDetailsService } from '../../order-details.service';
import { Observable, of } from 'rxjs';
import { HierarchyComponentService, HierarchyNode } from '@spartacus/storefront';

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

  entryGroups$: Observable<OrderEntryGroup[]> = of([]);
  entries$: Observable<OrderEntry[]> = of([]);
  bundles$: Observable<HierarchyNode[]> = of([]);
  standaloneEntries: OrderEntry[] = [];
  consignmentsEntryGroups$: Observable<OrderEntryGroup[]> = of([]);


  constructor(
    protected orderDetailsService: OrderDetailsService,
    protected hierarchyService: HierarchyComponentService,
  ) {}

  ngOnInit() {
    if (this.featureConfig.isEnabled('enableBundles')) {
      // All entryGroups from order
      this.entryGroups$ = this.orderDetailsService.getEntryGroups();
      // All entries type is STANDALONE
      this.entries$ = this.hierarchyService.getEntriesFromGroups(this.entryGroups$);
      this.entries$.subscribe(entries => {
        this.standaloneEntries = this.consignments.map(consignment =>
          this.filterStandaloneEntriesInConsignment(consignment.entries || [], entries),
        ).flat();
      });

      if (this.consignments && this.consignments.every(consignment => consignment.deliveryPointOfService)) {
        // pickup consignments
        this.consignmentsEntryGroups$ = this.orderDetailsService.getPickupEntryGroups();
      } else {
        // shipping consignments
        this.consignmentsEntryGroups$ = this.orderDetailsService.getDeliveryEntryGroups();
      }

      this.bundles$ = this.hierarchyService.getBundlesFromGroups(
        this.consignmentsEntryGroups$
      );
    }
  }

  filterStandaloneEntriesInConsignment(
    consignmentEntries: ConsignmentEntry[],
    standaloneEntries: OrderEntry[]
  ): OrderEntry[] {
    return consignmentEntries.filter(entry =>
      standaloneEntries.some(e => e.entryNumber === entry.orderEntry?.entryNumber)
    );
  }


}
