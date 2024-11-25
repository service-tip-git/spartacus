/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { OrderEntry } from '@spartacus/cart/base/root';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OrderAmendService } from '../../amend-order.service';
import { NgIf, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { CancelOrReturnItemsComponent } from '../../amend-order-items/amend-order-items.component';
import { FormErrorsComponent } from '../../../../../../projects/storefrontlib/shared/components/form/form-errors/form-errors.component';
import { AmendOrderActionsComponent } from '../../amend-order-actions/amend-order-actions.component';

@Component({
    selector: 'cx-return-order',
    templateUrl: './return-order.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgIf,
        NgTemplateOutlet,
        CancelOrReturnItemsComponent,
        FormErrorsComponent,
        AmendOrderActionsComponent,
        AsyncPipe,
    ],
})
export class ReturnOrderComponent {
  orderCode: string;

  form$: Observable<UntypedFormGroup> = this.orderAmendService
    .getForm()
    .pipe(tap((form) => (this.orderCode = form.value.orderCode)));

  entries$: Observable<OrderEntry[]> = this.orderAmendService.getEntries();

  constructor(protected orderAmendService: OrderAmendService) {}
}
