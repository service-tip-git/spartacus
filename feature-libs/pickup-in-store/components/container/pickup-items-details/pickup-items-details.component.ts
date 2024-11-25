/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CmsPickupItemDetails, useFeatureStyles } from '@spartacus/core';
import { DeliveryPointOfService } from '@spartacus/pickup-in-store/root';
import { CmsComponentData, ICON_TYPE } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { DeliveryPointsService } from '../../services/delivery-points.service';
import { NgClass, NgIf, NgFor, AsyncPipe } from '@angular/common';
import { StoreAddressComponent } from '../../presentational/store/store-address/store-address.component';
import { StoreScheduleComponent } from '../../presentational/store/store-schedule/store-schedule.component';
import { RouterLink } from '@angular/router';
import { IconComponent } from '@spartacus/storefront';
import { MediaComponent } from '@spartacus/storefront';
import { TranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { MockTranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-pick-up-in-store-items-details',
  templateUrl: './pickup-items-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgIf,
    NgFor,
    StoreAddressComponent,
    StoreScheduleComponent,
    RouterLink,
    IconComponent,
    MediaComponent,
    AsyncPipe,
    TranslatePipe,
    UrlPipe,
    MockTranslatePipe,
  ],
})
export class PickUpItemsDetailsComponent implements OnInit {
  @Input() showEdit: boolean;
  @Input() itemsDetails: Observable<Array<DeliveryPointOfService>>;
  readonly ICON_TYPE = ICON_TYPE;

  protected context: string;

  constructor(
    protected component: CmsComponentData<CmsPickupItemDetails>,
    protected deliveryPointsService: DeliveryPointsService
  ) {
    useFeatureStyles('a11yQTY2Quantity');
  }
  ngOnInit() {
    this.component.data$
      .pipe(
        tap((data: CmsPickupItemDetails) => {
          this.showEdit = data.showEdit;
          this.context = data.context;
          this.itemsDetails =
            data.context === 'order'
              ? this.deliveryPointsService.getDeliveryPointsOfServiceFromOrder()
              : this.deliveryPointsService.getDeliveryPointsOfServiceFromCart();
        }),
        take(1)
      )
      .subscribe();
  }
}
