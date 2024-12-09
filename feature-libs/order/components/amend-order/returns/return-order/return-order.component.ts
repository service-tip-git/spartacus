/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { OrderEntry, OrderEntryGroup, CartOutlets, CartType, PromotionLocation } from '@spartacus/cart/base/root';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OrderAmendService } from '../../amend-order.service';
import { OrderReturnService } from '../order-return.service';
import {
  HierarchyNode,
  HierarchyComponentService,
} from '@spartacus/storefront';
import { FeatureConfigService } from '@spartacus/core';
@Component({
  selector: 'cx-return-order',
  templateUrl: './return-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnOrderComponent implements OnInit {
  orderCode: string;

  form$: Observable<UntypedFormGroup> = this.orderAmendService
    .getForm()
    .pipe(tap((form) => (this.orderCode = form.value.orderCode)));
  allEntries$: Observable<OrderEntry[]>;
  entries$: Observable<OrderEntry[]>;
  bundles$: Observable<HierarchyNode[]>;
  entryGroups$: Observable<OrderEntryGroup[]>;
  bundlesTemplate: any;
  hasActionButton: boolean= true;
  private featureConfig = inject(FeatureConfigService);
  isBundleConfig: boolean = this.featureConfig.isEnabled('enableBundles');
  readonly CartOutlets = CartOutlets;
  readonly CartType = CartType;
  CartLocation = PromotionLocation;

  constructor(
    protected orderAmendService: OrderAmendService,
    protected hierarchyService: HierarchyComponentService,
    protected orderReturnService: OrderReturnService,
  ) {}

  ngOnInit(): void {
    if (this.featureConfig.isEnabled('enableBundles')) {
      this.entryGroups$ = this.orderReturnService.getOrderEntryGroups();
      this.allEntries$ = this.orderAmendService.getEntries();
      this.entries$ = this.hierarchyService.getEntriesFromGroups(
        this.entryGroups$
      );
      this.bundles$ = this.hierarchyService.getBundlesFromGroups(
        this.entryGroups$
      );
    } else {
      this.entries$ = this.orderAmendService.getEntries();
    }
  }
}

