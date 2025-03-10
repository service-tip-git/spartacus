/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { Cart, OrderEntry } from '@spartacus/cart/base/root';
import { WishListFacade } from '@spartacus/cart/wish-list/root';
import { useFeatureStyles } from '@spartacus/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'cx-wish-list',
  templateUrl: './wish-list.component.html',
  standalone: false,
})
export class WishListComponent {
  wishList$: Observable<Cart> = this.wishListFacade.getWishList();
  loading$: Observable<boolean> = this.wishListFacade.getWishListLoading();

  constructor(protected wishListFacade: WishListFacade) {
    useFeatureStyles('a11yVisibleFocusOverflows');
  }

  removeEntry(item: OrderEntry) {
    this.wishListFacade.removeEntry(item);
  }
}
