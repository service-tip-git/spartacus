/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { OrderEntry } from '@spartacus/cart/base/root';
import { GlobalMessageType } from '@spartacus/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OrderAmendService } from '../../amend-order.service';
import { MockTranslatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { AmendOrderActionsComponent } from '../../amend-order-actions/amend-order-actions.component';
import { FormErrorsComponent } from '@spartacus/storefront';
import { FeatureDirective } from '@spartacus/core';
import { CancelOrReturnItemsComponent } from '../../amend-order-items/amend-order-items.component';
import { MessageComponent } from '@spartacus/storefront';
import { NgIf, NgTemplateOutlet, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-cancel-order',
  templateUrl: './cancel-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    MessageComponent,
    NgTemplateOutlet,
    CancelOrReturnItemsComponent,
    FeatureDirective,
    FormErrorsComponent,
    AmendOrderActionsComponent,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class CancelOrderComponent {
  orderCode: string;
  globalMessageType = GlobalMessageType;

  form$: Observable<UntypedFormGroup> = this.orderAmendService
    .getForm()
    .pipe(tap((form) => (this.orderCode = form.value.orderCode)));

  entries$: Observable<OrderEntry[]> = this.orderAmendService.getEntries();

  constructor(protected orderAmendService: OrderAmendService) {}
}
