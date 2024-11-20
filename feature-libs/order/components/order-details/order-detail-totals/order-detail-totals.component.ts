/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnInit } from '@angular/core';
import { CartOutlets } from '@spartacus/cart/base/root';
import { Observable } from 'rxjs';
import { OrderDetailsService } from '../order-details.service';
import { OutletDirective } from '@spartacus/storefront';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-order-details-totals',
  templateUrl: './order-detail-totals.component.html',
  standalone: true,
  imports: [NgIf, OutletDirective, AsyncPipe],
})
export class OrderDetailTotalsComponent implements OnInit {
  constructor(protected orderDetailsService: OrderDetailsService) {}

  order$: Observable<any>;

  readonly CartOutlets = CartOutlets;

  ngOnInit() {
    this.order$ = this.orderDetailsService.getOrderDetails();
  }
}
