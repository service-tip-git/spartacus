import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  ActiveCartFacade,
  Cart,
  CartVoucherFacade,
  Voucher,
} from '@spartacus/cart/base/root';
import {
  CustomerCouponSearchResult,
  CustomerCouponService,
  I18nTestingModule,
} from '@spartacus/core';
import { FormErrorsModule } from '@spartacus/storefront';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { MockFeatureDirective } from 'projects/storefrontlib/shared/test/mock-feature-directive';
import { EMPTY, of } from 'rxjs';
import { CartCouponComponent } from './cart-coupon.component';

@Component({
  selector: 'cx-applied-coupons',
  template: '',
  standalone: false,
})
class MockAppliedCouponsComponent {
  @Input()
  vouchers: Voucher[];
  @Input()
  cartIsLoading = false;
  @Input()
  isReadOnly = false;
}

describe('CartCouponComponent', () => {
  let component: CartCouponComponent;
  let fixture: ComponentFixture<CartCouponComponent>;
  let input: HTMLInputElement;
  let el: DebugElement;

  const mockActiveCartService = jasmine.createSpyObj('ActiveCartService', [
    'getActive',
    'getActiveCartId',
    'isStable',
  ]);

  const mockCartVoucherService = jasmine.createSpyObj('CartVoucherService', [
    'addVoucher',
    'getAddVoucherResultSuccess',
    'resetAddVoucherProcessingState',
    'getAddVoucherResultLoading',
    'getAddVoucherResultError',
  ]);

  const mockCustomerCouponService = jasmine.createSpyObj(
    'CustomerCouponService',
    ['loadCustomerCoupons', 'getCustomerCoupons']
  );

  const couponsSearchResult: CustomerCouponSearchResult = {
    coupons: [
      {
        couponId: 'CustomerCoupon1',
      },
      {
        couponId: 'CustomerCoupon2',
      },
    ],
  };

  const appliedVouchers: Voucher[] = [{ code: 'CustomerCoupon1' }];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule, ReactiveFormsModule, FormErrorsModule],
      declarations: [
        CartCouponComponent,
        MockAppliedCouponsComponent,
        MockFeatureDirective,
      ],
      providers: [
        { provide: ActiveCartFacade, useValue: mockActiveCartService },
        { provide: CartVoucherFacade, useValue: mockCartVoucherService },
        {
          provide: CustomerCouponService,
          useValue: mockCustomerCouponService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartCouponComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;

    mockActiveCartService.getActive.and.returnValue(
      of({ code: '123' } as Cart)
    );
    mockActiveCartService.getActiveCartId.and.returnValue(of('123'));
    mockActiveCartService.isStable.and.returnValue(of(true));
    mockCartVoucherService.getAddVoucherResultSuccess.and.returnValue(EMPTY);
    mockCartVoucherService.getAddVoucherResultLoading.and.returnValue(EMPTY);
    mockCartVoucherService.addVoucher.and.stub();
    mockCartVoucherService.resetAddVoucherProcessingState.and.stub();
    mockCartVoucherService.resetAddVoucherProcessingState.calls.reset();
    mockCartVoucherService.getAddVoucherResultError.and.returnValue(EMPTY);
    mockCustomerCouponService.loadCustomerCoupons.and.stub();
    mockCustomerCouponService.getCustomerCoupons.and.returnValue(of({}));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show coupon input and submit button', () => {
    mockCartVoucherService.getAddVoucherResultLoading.and.returnValue(
      of(false)
    );
    fixture.detectChanges();

    expect(el.query(By.css('.cx-cart-coupon-title'))).toBeTruthy();
    expect(el.query(By.css('.input-coupon-code'))).toBeTruthy();
    expect(el.query(By.css('.apply-coupon-button'))).toBeTruthy();
    expect(el.query(By.css('.apply-coupon-button'))).toBeTruthy();
  });

  it('should form is valid when inputting coupon code', () => {
    fixture.detectChanges();
    expect(component.couponForm.valid).toBeFalsy();

    input = el.query(By.css('.input-coupon-code')).nativeElement;
    input.value = 'couponCode1';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.couponForm.controls['couponCode'].value).toBe(
      'couponCode1'
    );
  });

  it('should disable button when coupon is in process', () => {
    mockCartVoucherService.getAddVoucherResultLoading.and.returnValue(
      hot('-a', { a: true })
    );
    fixture.detectChanges();

    const applyBtn = el.query(By.css('.apply-coupon-button')).nativeElement;

    input = el.query(By.css('.input-coupon-code')).nativeElement;
    input.value = 'couponCode1';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    mockCartVoucherService.getAddVoucherResultLoading.and.returnValue(
      cold('-a', { a: true })
    );
    applyBtn.click();

    getTestScheduler().flush();
    fixture.detectChanges();

    expect(mockCartVoucherService.addVoucher).toHaveBeenCalled();
  });

  it('should coupon is applied successfully', () => {
    mockCartVoucherService.getAddVoucherResultLoading.and.returnValue(of(true));
    mockCartVoucherService.getAddVoucherResultSuccess.and.returnValue(of(true));

    fixture.detectChanges();

    input = el.query(By.css('.input-coupon-code')).nativeElement;
    input.value = 'couponCode1';
    el.query(By.css('.apply-coupon-button')).nativeElement.click();
    expect(component.couponForm.controls['couponCode'].value).toBeNull();
  });

  it('should not list customer coupons when no customer coupons', () => {
    fixture.detectChanges();
    expect(
      fixture.debugElement.queryAll(By.css('.cx-available-coupon')).length
    ).toEqual(0);
  });

  it('should list customer coupons when has customer coupons', () => {
    mockCustomerCouponService.getCustomerCoupons.and.returnValue(
      of(couponsSearchResult)
    );
    fixture.detectChanges();

    expect(
      fixture.debugElement.queryAll(By.css('.cx-available-coupon .title'))
        .length
    ).toEqual(1);
    expect(
      fixture.debugElement.queryAll(By.css('.cx-available-coupon .message'))
        .length
    ).toEqual(1);
    expect(
      fixture.debugElement.queryAll(By.css('.cx-available-coupon .card')).length
    ).toEqual(2);
  });

  it('should not show applied customer coupon', () => {
    mockActiveCartService.getActive.and.returnValue(
      of({ appliedVouchers: appliedVouchers } as Cart)
    );
    mockCustomerCouponService.getCustomerCoupons.and.returnValue(
      of(couponsSearchResult)
    );
    fixture.detectChanges();
    expect(
      fixture.debugElement.queryAll(By.css('.cx-available-coupon .card')).length
    ).toEqual(1);
  });

  it('should apply customer coupons', () => {
    mockCustomerCouponService.getCustomerCoupons.and.returnValue(
      of(couponsSearchResult)
    );
    fixture.detectChanges();
    const customerCoupon = el.queryAll(By.css('.cx-available-coupon .card'))[0]
      .nativeElement;
    customerCoupon.click();
    fixture.detectChanges();
    expect(mockCartVoucherService.addVoucher).toHaveBeenCalled();
  });

  it('should reload customer coupons on apply error', () => {
    mockCartVoucherService.getAddVoucherResultError.and.returnValue(of(true));
    fixture.detectChanges();
    expect(mockCustomerCouponService.loadCustomerCoupons).toHaveBeenCalled();
  });

  it('should reset state when on destroy is triggered', () => {
    mockCartVoucherService.getAddVoucherResultLoading.and.returnValue(of(true));
    mockCartVoucherService.getAddVoucherResultSuccess.and.returnValue(of(true));
    fixture.detectChanges();

    component.ngOnDestroy();
    expect(
      mockCartVoucherService.resetAddVoucherProcessingState
    ).toHaveBeenCalled();
  });
});
