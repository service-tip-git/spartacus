/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cart } from '@spartacus/cart/base/root';
import { Product } from '@spartacus/core';
import { OpfActiveConfiguration } from '@spartacus/opf/base/root';
import { OpfPaymentErrorHandlerService } from '@spartacus/opf/payment/core';
import { OpfQuickBuyTransactionService } from '@spartacus/opf/quick-buy/core';
import {
  OpfQuickBuyDigitalWallet,
  OpfQuickBuyLocation,
  OpfQuickBuyProviderType,
} from '@spartacus/opf/quick-buy/root';
import { CurrentProductService } from '@spartacus/storefront';
import { of } from 'rxjs';
import { ApplePayComponent } from './apple-pay.component';
import { ApplePayService } from './apple-pay.service';

const mockProduct: Product = {
  name: 'mockProduct',
  code: 'code1',
  stock: {
    stockLevel: 333,
    stockLevelStatus: 'inStock',
  },
};

const mockCart: Cart = {
  code: '123',
};

const mockActiveConfiguration: OpfActiveConfiguration = {
  digitalWalletQuickBuy: [
    {
      merchantId: 'merchant.com.adyen.upscale.test',
      provider: OpfQuickBuyProviderType.APPLE_PAY,
      countryCode: 'US',
    },
    { merchantId: 'merchant.test.example' },
  ],
};

describe('ApplePayComponent', () => {
  let component: ApplePayComponent;
  let fixture: ComponentFixture<ApplePayComponent>;
  let mockApplePayService: jasmine.SpyObj<ApplePayService>;
  let mockCurrentProductService: jasmine.SpyObj<CurrentProductService>;
  let mockOpfPaymentErrorHandlerService: jasmine.SpyObj<OpfPaymentErrorHandlerService>;
  let mockOpfQuickBuyTransactionService: jasmine.SpyObj<OpfQuickBuyTransactionService>;
  const mockCountryCode = 'US';

  beforeEach(() => {
    mockApplePayService = jasmine.createSpyObj('ApplePayService', [
      'start',
      'isApplePaySupported',
    ]);
    mockCurrentProductService = jasmine.createSpyObj('CurrentProductService', [
      'getProduct',
    ]);
    mockOpfPaymentErrorHandlerService = jasmine.createSpyObj(
      'OpfPaymentErrorHandlerService',
      ['handlePaymentError']
    );
    mockOpfQuickBuyTransactionService = jasmine.createSpyObj(
      'OpfQuickBuyTransactionService',
      ['getTransactionLocationContext', 'checkStableCart', 'getCurrentCart']
    );

    TestBed.configureTestingModule({
      declarations: [ApplePayComponent],
      providers: [
        { provide: ApplePayService, useValue: mockApplePayService },
        { provide: CurrentProductService, useValue: mockCurrentProductService },
        {
          provide: OpfPaymentErrorHandlerService,
          useValue: mockOpfPaymentErrorHandlerService,
        },
        {
          provide: OpfQuickBuyTransactionService,
          useValue: mockOpfQuickBuyTransactionService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplePayComponent);
    component = fixture.componentInstance;

    const mockProductObservable = of(mockProduct);
    const mockCartObservable = of(mockCart);

    mockCurrentProductService.getProduct.and.returnValue(mockProductObservable);
    mockOpfQuickBuyTransactionService.getTransactionLocationContext.and.returnValue(
      of(OpfQuickBuyLocation.PRODUCT)
    );
    mockOpfQuickBuyTransactionService.getCurrentCart.and.returnValue(
      mockCartObservable
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isApplePaySupported$ provider is Apple pay', () => {
    const digitalWallet: OpfQuickBuyDigitalWallet = {
      provider: OpfQuickBuyProviderType.APPLE_PAY,
      countryCode: mockCountryCode,
      merchantId: 'merchant.com.adyen.upscale.test',
    };
    component.activeConfiguration = { digitalWalletQuickBuy: [digitalWallet] };

    const mockObservable = of(true);
    mockApplePayService.isApplePaySupported.and.returnValue(mockObservable);

    fixture.detectChanges();
    expect(component.isApplePaySupported$).toBe(mockObservable);
  });

  it('should not initialize isApplePaySupported$ provider is not Apple pay', () => {
    const digitalWallet: OpfQuickBuyDigitalWallet = {
      provider: OpfQuickBuyProviderType.GOOGLE_PAY,
      countryCode: mockCountryCode,
      merchantId: 'merchant.com.adyen.upscale.test',
    };
    component.activeConfiguration = { digitalWalletQuickBuy: [digitalWallet] };

    const mockObservable = of(true);
    mockApplePayService.isApplePaySupported.and.returnValue(mockObservable);

    fixture.detectChanges();
    expect(mockApplePayService.isApplePaySupported).not.toHaveBeenCalled();
  });

  it('should start applePayService', () => {
    mockApplePayService.start.and.returnValue(
      of(<ApplePayJS.ApplePayPaymentAuthorizationResult>{ status: 1 })
    );
    component.activeConfiguration = {
      digitalWalletQuickBuy: [
        {
          provider: OpfQuickBuyProviderType.APPLE_PAY,
          countryCode: mockCountryCode,
          merchantId: 'merchant.com.adyen.upscale.test',
        },
      ],
    };
    component.activeConfiguration = mockActiveConfiguration;
    fixture.detectChanges();

    component.initTransaction();
    expect(
      mockOpfPaymentErrorHandlerService.handlePaymentError
    ).not.toHaveBeenCalled();
  });
});
