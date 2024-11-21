/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, Input } from '@angular/core';
import { PointOfService } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { StoreScheduleComponent } from '../store/store-schedule/store-schedule.component';
import { StoreAddressComponent } from '../store/store-address/store-address.component';

@Component({
  selector: 'cx-pickup-info',
  templateUrl: './pickup-info.component.html',
  standalone: true,
  imports: [
    StoreAddressComponent,
    StoreScheduleComponent,
    TranslatePipe,
    TranslatePipe,
  ],
})
export class PickupInfoComponent {
  @Input() storeDetails: PointOfService;
}
