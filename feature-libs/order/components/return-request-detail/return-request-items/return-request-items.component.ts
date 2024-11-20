/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReturnRequest } from '@spartacus/order/root';
import { Observable } from 'rxjs';
import { ReturnRequestService } from '../return-request.service';
import { MockTranslatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { MediaComponent } from '@spartacus/storefront';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-return-request-items',
  templateUrl: './return-request-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MediaComponent,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class ReturnRequestItemsComponent {
  constructor(protected returnRequestService: ReturnRequestService) {}

  returnRequest$: Observable<ReturnRequest> =
    this.returnRequestService.getReturnRequest();
}
