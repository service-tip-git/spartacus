/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActiveCartFacade, Cart } from '@spartacus/cart/base/root';
import { Observable } from 'rxjs';

@Component({
  selector: 'cx-cart-totals',
  templateUrl: './cart-totals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CartTotalsComponent implements OnInit {
  cart$: Observable<Cart>;

  constructor(protected activeCartService: ActiveCartFacade) {}

  ngOnInit() {
    this.cart$ = this.activeCartService.getActive();
  }
}
