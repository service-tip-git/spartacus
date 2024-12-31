/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ReturnRequest } from '@spartacus/order/root';
import { Observable } from 'rxjs';
import { ReturnRequestService } from '../return-request.service';
import { FeatureConfigService } from '@spartacus/core';
import { OrderEntry, OrderEntryGroup } from '@spartacus/cart/base/root';
import {
  HierarchyNode,
  HierarchyComponentService,
} from '@spartacus/storefront';
@Component({
  selector: 'cx-return-request-items',
  templateUrl: './return-request-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnRequestItemsComponent implements OnInit {
  entryGroups$: Observable<OrderEntryGroup[]>;
  requestOrderEntryGroups$: Observable<OrderEntryGroup[]>;
  bundles$: Observable<HierarchyNode[]>;
  entries$: Observable<OrderEntry[]>;
  private featureConfig = inject(FeatureConfigService);
  returnRequest$: Observable<ReturnRequest> =
    this.returnRequestService.getReturnRequest();
  constructor(
    protected returnRequestService: ReturnRequestService,
    protected hierarchyService: HierarchyComponentService
  ) { }

  ngOnInit(): void {
    if (this.featureConfig.isEnabled('enableBundles')) {
      this.entryGroups$ = this.returnRequestService.getOrderEntryGroups();
      this.requestOrderEntryGroups$ = this.returnRequestService.getRequestOrderEntryGroups(this.returnRequest$, this.entryGroups$);
      this.entries$ = this.hierarchyService.getEntriesFromGroups(
        this.requestOrderEntryGroups$
      );
      this.bundles$ = this.hierarchyService.getBundlesFromGroups(
        this.requestOrderEntryGroups$
      );
    }
  }
}
