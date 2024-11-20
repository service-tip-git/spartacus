/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReturnRequest } from '@spartacus/order/root';
import { Observable } from 'rxjs';
import { ReturnRequestService } from '../return-request.service';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { MediaComponent } from '../../../../../projects/storefrontlib/shared/components/media/media.component';
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
