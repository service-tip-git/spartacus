/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked,
  inject,
} from '@angular/core';
import { OrderOutlets } from '@spartacus/order/root';
import { InvoicesListComponent } from '@spartacus/pdf-invoices/components';
import {
  ICON_TYPE,
  FocusConfig,
  LaunchDialogService,
} from '@spartacus/storefront';
import { FocusDirective } from '@spartacus/storefront';
import { IconComponent } from '@spartacus/storefront';
import { InvoicesListComponent as InvoicesListComponent_1 } from '../../../../../pdf-invoices/components/invoices-list/invoices-list.component';
import { NgIf } from '@angular/common';
import { SpinnerComponent } from '@spartacus/storefront';
import { TranslatePipe } from '@spartacus/core';
import { MockTranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-my-account-v2-download-invoices',
  templateUrl: './my-account-v2-download-invoices.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FocusDirective,
    IconComponent,
    InvoicesListComponent_1,
    NgIf,
    SpinnerComponent,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class MyAccountV2DownloadInvoicesComponent implements AfterViewChecked {
  @ViewChild(InvoicesListComponent, { static: false })
  public invoiceComponent: InvoicesListComponent;
  readonly OrderOutlets = OrderOutlets;
  invoiceCount: number | undefined = undefined;
  iconTypes = ICON_TYPE;
  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: true,
    focusOnEscape: true,
  };

  protected launchDialogService = inject(LaunchDialogService);
  protected cdr = inject(ChangeDetectorRef);

  ngAfterViewChecked() {
    this.cdr.detectChanges();
    if (
      this.invoiceComponent &&
      this.invoiceComponent.pagination !== undefined
    ) {
      this.invoiceCount = this.invoiceComponent.pagination.totalResults;
    }
  }

  close(reason?: any, _message?: string): void {
    this.launchDialogService.closeDialog(reason);
  }
}
