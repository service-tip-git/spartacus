/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { ICON_TYPE } from '@spartacus/storefront';
import { FutureStockFacade } from '@spartacus/product/future-stock/root';
import { MockTranslatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { IconComponent } from '@spartacus/storefront';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-future-stock-accordion',
  templateUrl: './future-stock-accordion.component.html',
  standalone: true,
  imports: [
    NgIf,
    IconComponent,
    NgFor,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class FutureStockAccordionComponent {
  futureStocks$ = this.futureStockService.getFutureStock();
  expanded: boolean = false;
  iconType = ICON_TYPE;

  constructor(protected futureStockService: FutureStockFacade) {}

  toggle(): void {
    this.expanded = !this.expanded;
  }
}
