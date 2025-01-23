/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnDestroy, OnInit, Optional, inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  ActiveCartFacade,
  Cart,
  CartVoucherFacade,
} from '@spartacus/cart/base/root';
import {
  CustomerCoupon,
  CustomerCouponSearchResult,
  CustomerCouponService,
  FeatureConfigService,
} from '@spartacus/core';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'cx-cart-coupon',
  templateUrl: './cart-coupon.component.html',
  standalone: false,
})
export class CartCouponComponent implements OnInit, OnDestroy {
  MAX_CUSTOMER_COUPON_PAGE = 100;
  couponForm: UntypedFormGroup;
  cartIsLoading$: Observable<boolean>;
  cart$: Observable<Cart>;
  cartId: string;
  applicableCoupons: CustomerCoupon[];

  protected ignoreCloseEvent = false;

  protected subscription = new Subscription();

  couponBoxIsActive = false;

  @Optional() protected featureConfigService = inject(FeatureConfigService, {
    optional: true,
  });

  constructor(
    protected cartVoucherService: CartVoucherFacade,
    protected formBuilder: UntypedFormBuilder,
    protected customerCouponService: CustomerCouponService,
    protected activeCartService: ActiveCartFacade
  ) {}

  ngOnInit() {
    if (this.customerCouponService) {
      this.customerCouponService.loadCustomerCoupons(
        this.MAX_CUSTOMER_COUPON_PAGE
      );
    }

    this.cart$ = combineLatest([
      this.activeCartService.getActive(),
      this.activeCartService.getActiveCartId(),
      this.customerCouponService.getCustomerCoupons(
        this.MAX_CUSTOMER_COUPON_PAGE
      ),
    ]).pipe(
      tap(
        ([cart, activeCardId, customerCoupons]: [
          Cart,
          string,
          CustomerCouponSearchResult,
        ]) => {
          this.cartId = activeCardId;
          this.getApplicableCustomerCoupons(
            cart,
            customerCoupons.coupons ?? []
          );
        }
      ),
      map(([cart]: [Cart, string, CustomerCouponSearchResult]) => cart)
    );

    this.cartIsLoading$ = this.activeCartService
      .isStable()
      .pipe(map((loaded) => !loaded));

    this.cartVoucherService.resetAddVoucherProcessingState();

    // TODO: (CXSPA-7479) Remove feature flags next major
    const shouldHaveRequiredValidator = !this.featureConfigService?.isEnabled(
      'a11yDisabledCouponAndQuickOrderActionButtonsInsteadOfRequiredFields'
    );

    this.couponForm = this.formBuilder.group({
      couponCode: [
        '',
        shouldHaveRequiredValidator ? [Validators.required] : [],
      ],
    });

    // TODO(#7241): Replace process subscriptions with event listeners and drop process for ADD_VOUCHER
    this.subscription.add(
      this.cartVoucherService
        .getAddVoucherResultSuccess()
        .subscribe((success) => {
          this.onSuccess(success);
        })
    );

    // TODO(#7241): Replace process subscriptions with event listeners and drop process for ADD_VOUCHER
    this.subscription.add(
      this.cartVoucherService.getAddVoucherResultError().subscribe((error) => {
        this.onError(error);
      })
    );
  }

  protected onError(error: boolean) {
    if (error) {
      this.customerCouponService.loadCustomerCoupons(
        this.MAX_CUSTOMER_COUPON_PAGE
      );
      this.cartVoucherService.resetAddVoucherProcessingState();
    }
  }

  onSuccess(success: boolean) {
    if (success) {
      this.couponForm.reset();
      this.cartVoucherService.resetAddVoucherProcessingState();
    }
  }

  protected getApplicableCustomerCoupons(
    cart: Cart,
    coupons: CustomerCoupon[]
  ): void {
    this.applicableCoupons = coupons || [];
    if (cart.appliedVouchers) {
      cart.appliedVouchers.forEach((appliedVoucher) => {
        this.applicableCoupons = this.applicableCoupons.filter(
          (coupon) => coupon.couponId !== appliedVoucher.code
        );
      });
    }
  }

  applyVoucher(): void {
    if (this.couponForm.valid) {
      this.cartVoucherService.addVoucher(
        this.couponForm.value.couponCode,
        this.cartId
      );
    } else {
      this.couponForm.markAllAsTouched();
    }
  }

  applyCustomerCoupon(couponId: string): void {
    this.cartVoucherService.addVoucher(couponId, this.cartId);
    this.couponBoxIsActive = false;
  }

  close(event: UIEvent): void {
    if (!this.ignoreCloseEvent) {
      this.couponBoxIsActive = false;
      if (event && event.target) {
        (<HTMLElement>event.target).blur();
      }
    }
    this.ignoreCloseEvent = false;
  }

  disableClose(): void {
    this.ignoreCloseEvent = true;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.cartVoucherService.resetAddVoucherProcessingState();
  }
}
