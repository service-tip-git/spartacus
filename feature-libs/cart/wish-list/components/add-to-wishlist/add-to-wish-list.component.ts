/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { OrderEntry } from '@spartacus/cart/base/root';
import { WishListFacade } from '@spartacus/cart/wish-list/root';
import {
  AuthService,
  FeatureConfigService,
  isNotNullable,
  Product,
  useFeatureStyles,
} from '@spartacus/core';
import { CurrentProductService, ICON_TYPE } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { UrlPipe } from '../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { AtMessageDirective } from '../../../../../projects/storefrontlib/shared/components/assistive-technology-message/assistive-technology-message.directive';
import { FeatureDirective } from '../../../../../projects/core/src/features-config/directives/feature.directive';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-add-to-wishlist',
  templateUrl: './add-to-wish-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    FeatureDirective,
    AtMessageDirective,
    IconComponent,
    RouterLink,
    AsyncPipe,
    TranslatePipe,
    UrlPipe,
    MockTranslatePipe,
  ],
})
export class AddToWishListComponent {
  product$: Observable<Product> = this.currentProductService.getProduct().pipe(
    filter(isNotNullable),
    tap((product) => this.setStockInfo(product))
  );

  wishListEntries$: Observable<OrderEntry[]>;
  loading$: Observable<boolean>;

  @ViewChild('addToWishlistButton') addToWishlistButton: ElementRef;
  @ViewChild('removeFromWishlistButton') removeFromWishlistButton: ElementRef;

  private featureConfigService = inject(FeatureConfigService);

  userLoggedIn$: Observable<boolean> = this.authService.isUserLoggedIn().pipe(
    tap((isLogin) => {
      if (isLogin) {
        this.wishListEntries$ = this.getWishListEntries();
        this.loading$ = this.wishListFacade.getWishListLoading();
      }
    })
  );

  hasStock = false;
  iconTypes = ICON_TYPE;

  constructor(
    protected wishListFacade: WishListFacade,
    protected currentProductService: CurrentProductService,
    protected authService: AuthService
  ) {
    useFeatureStyles('a11yVisibleFocusOverflows');
  }

  add(product: Product): void {
    if (product.code) {
      this.wishListFacade.addEntry(product.code);
      if (this.featureConfigService.isEnabled('a11yAddToWishlistFocus')) {
        this.restoreFocus();
      }
    }
  }

  remove(entry: OrderEntry): void {
    this.wishListFacade.removeEntry(entry);
    if (this.featureConfigService.isEnabled('a11yAddToWishlistFocus')) {
      this.restoreFocus();
    }
  }

  getProductInWishList(
    product: Product,
    entries: OrderEntry[]
  ): OrderEntry | undefined {
    const item = entries.find((entry) => entry.product?.code === product.code);
    return item;
  }

  protected setStockInfo(product: Product): void {
    this.hasStock = Boolean(
      product.stock && product.stock.stockLevelStatus !== 'outOfStock'
    );
  }

  protected getWishListEntries(): Observable<OrderEntry[]> {
    return this.wishListFacade.getWishList().pipe(
      filter((wishlist) => Boolean(wishlist)),
      map((wishList) => wishList.entries ?? [])
    );
  }

  /**
   * When disabling the button, the focus gets lost unexpecedly.
   * This method makes sure that it is restored after.
   */
  protected restoreFocus(): void {
    this.loading$
      .pipe(
        filter((isLoading) => !isLoading),
        take(1)
      )
      .subscribe(() => {
        this.removeFromWishlistButton?.nativeElement.focus() ||
          this.addToWishlistButton?.nativeElement.focus();
      });
  }
}
