/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Component,
  ChangeDetectionStrategy,
  Input,
  inject,
} from '@angular/core';
import { OrderEntry } from '@spartacus/cart/base/root';
import { Images } from '@spartacus/core';
import { MyAccountV2OrderConsignmentsService } from '../../../order-details';
import {
  ConsignmentView,
  OrderView,
  OrderHistoryView,
} from '@spartacus/order/root';
import { OrderCriticalStatus } from '../my-account-v2-order-history.model';
import { NgIf, NgTemplateOutlet, NgFor } from '@angular/common';
import { MyAccountV2ConsignmentEntriesComponent } from '../consignment-entries/my-account-v2-consignment-entries.component';
import { RouterLink } from '@angular/router';
import { MediaComponent } from '../../../../../../projects/storefrontlib/shared/components/media/media.component';
import { UrlPipe } from '../../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { TranslatePipe } from '../../../../../../projects/core/src/i18n/translate.pipe';
import { CxDatePipe } from '../../../../../../projects/core/src/i18n/date.pipe';
import { MockTranslatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { MockDatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-date.pipe';

@Component({
  selector: 'cx-my-account-v2-order-consolidated-information',
  templateUrl: './my-account-v2-order-consolidated-information.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    NgTemplateOutlet,
    MyAccountV2ConsignmentEntriesComponent,
    NgFor,
    RouterLink,
    MediaComponent,
    UrlPipe,
    TranslatePipe,
    CxDatePipe,
    MockTranslatePipe,
    MockDatePipe,
  ],
})
export class MyAccountV2OrderConsolidatedInformationComponent {
  protected orderConsignmentsService = inject(
    MyAccountV2OrderConsignmentsService
  );
  protected criticalStatuses = Object.values(OrderCriticalStatus);
  @Input()
  order?: OrderHistoryView;
  protected readonly IMAGE_COUNT = 4; //showing fixed no.of images, without using carousel
  getConsignmentsCount(consignments: ConsignmentView[] | undefined): number {
    let count = 0;
    if (consignments) {
      for (const consignment of consignments) {
        if (consignment.entries) {
          count = count + consignment.entries.length;
        }
      }
    }
    return count;
  }

  getOrderEntriesCount(orderEntries: OrderEntry[] | undefined): number {
    return orderEntries?.length ?? 0;
  }

  isStatusCritical(status: string): boolean {
    return this.criticalStatuses.includes(
      status.toUpperCase() as OrderCriticalStatus
    );
  }
  getPickupConsignments(consignments: ConsignmentView[]): ConsignmentView[] {
    const orderDetail: OrderView = {};
    orderDetail.consignments = consignments;
    return (
      this.orderConsignmentsService.getGroupedConsignments(orderDetail, true) ??
      []
    );
  }
  getDeliveryConsignments(consignments: ConsignmentView[]): ConsignmentView[] {
    const orderDetail: OrderView = {};
    orderDetail.consignments = consignments;
    return (
      this.orderConsignmentsService.getGroupedConsignments(
        orderDetail,
        false
      ) ?? []
    );
  }
  getDeliveryUnconsignedEntries(
    unconsignedEntries: OrderEntry[]
  ): OrderEntry[] {
    const orderDetail: OrderView = {};
    orderDetail.unconsignedEntries = unconsignedEntries;
    return (
      this.orderConsignmentsService.getUnconsignedEntries(orderDetail, false) ??
      []
    );
  }
  getPickupUnconsignedEntries(unconsignedEntries: OrderEntry[]): OrderEntry[] {
    const orderDetail: OrderView = {};
    orderDetail.unconsignedEntries = unconsignedEntries;
    return (
      this.orderConsignmentsService.getUnconsignedEntries(orderDetail, true) ??
      []
    );
  }
  getProductImages(entries: OrderEntry[]): Images[] {
    const images: Images[] = [];
    let index = 0;
    for (const item of entries) {
      if (item.product?.images) {
        if (index >= this.IMAGE_COUNT) {
          break;
        }
        index++;
        images.push(item.product?.images);
      }
    }
    return images;
  }
}
