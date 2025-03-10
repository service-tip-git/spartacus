import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Cart, CART_VOUCHER_NORMALIZER } from '@spartacus/cart/base/root';
import {
  ConverterService,
  OccConfig,
  OccEndpointsService,
} from '@spartacus/core';
import {
  MockOccEndpointsService,
  mockOccModuleConfig,
} from 'projects/core/src/occ/adapters/user/unit-test.helper';
import { OccCartVoucherAdapter } from './occ-cart-voucher.adapter';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

const userId = '123';
const cartId = '456';
const voucherId = 'testVocherId';
const cartData: Cart = {
  store: 'electronics',
  guid: '1212121',
};

describe('OccCartVoucherAdapter', () => {
  let service: OccCartVoucherAdapter;
  let httpMock: HttpTestingController;
  let converter: ConverterService;
  let occEnpointsService: OccEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        OccCartVoucherAdapter,
        { provide: OccConfig, useValue: mockOccModuleConfig },
        {
          provide: OccEndpointsService,
          useClass: MockOccEndpointsService,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(OccCartVoucherAdapter);
    httpMock = TestBed.inject(HttpTestingController);
    converter = TestBed.inject(ConverterService);
    occEnpointsService = TestBed.inject(OccEndpointsService);

    spyOn(converter, 'pipeable').and.callThrough();
    spyOn(occEnpointsService, 'buildUrl').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('add voucher to cart', () => {
    it('should add voucher to cart for given user id, cart id and voucher id', () => {
      let result;
      service.add(userId, cartId, voucherId).subscribe((res) => (result = res));

      const mockReq = httpMock.expectOne((req) => {
        return req.method === 'POST';
      });

      expect(occEnpointsService.buildUrl).toHaveBeenCalledWith('cartVoucher', {
        urlParams: {
          userId: userId,
          cartId: cartId,
        },
      });
      expect(mockReq.request.params.get('voucherId')).toEqual(voucherId);
      expect(mockReq.cancelled).toBeFalsy();
      mockReq.flush(cartData);
      expect(result).toEqual(cartData);
      expect(converter.pipeable).toHaveBeenCalledWith(CART_VOUCHER_NORMALIZER);
    });
  });

  describe('remove a voucher from cart', () => {
    it('should remove voucher from cart for given user id, cart id and voucher id', () => {
      let result;
      service
        .remove(userId, cartId, voucherId)
        .subscribe((res) => (result = res));

      const mockReq = httpMock.expectOne((req) => {
        return req.method === 'DELETE';
      });

      expect(occEnpointsService.buildUrl).toHaveBeenCalledWith('cartVoucher', {
        urlParams: {
          userId: userId,
          cartId: cartId,
        },
      });
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(cartData);
      expect(result).toEqual(cartData);
    });
  });
});
