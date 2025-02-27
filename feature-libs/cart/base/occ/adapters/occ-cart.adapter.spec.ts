import {
  HttpHeaders,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Cart, CART_NORMALIZER } from '@spartacus/cart/base/root';
import {
  BaseOccUrlProperties,
  ConverterService,
  DynamicAttributes,
  InterceptorUtil,
  Occ,
  OccEndpointsService,
  OCC_CART_ID_CURRENT,
  OCC_USER_ID_ANONYMOUS,
  ProductImageNormalizer,
  USE_CLIENT_TOKEN,
} from '@spartacus/core';
import { OccCartAdapter } from './occ-cart.adapter';

const userId = '123';
const cartId = '456';
const toMergeCart = { guid: '123456' };
const cartData: Occ.Cart = {
  store: 'electronics',
  guid: '1212121',
};
const cartDataList: Occ.CartList = {
  carts: [cartData],
};
const mergedCart: Cart = {
  name: 'mergedCart',
};

class MockOccEndpointsService {
  buildUrl(
    endpoint: string,
    _attributes?: DynamicAttributes,
    _propertiesToOmit?: BaseOccUrlProperties
  ) {
    return this.getEndpoint(endpoint);
  }
  getEndpoint(url: string) {
    return url;
  }
}

describe('OccCartAdapter', () => {
  let occCartAdapter: OccCartAdapter;
  let httpMock: HttpTestingController;
  let converterService: ConverterService;
  let occEndpointService: OccEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        OccCartAdapter,
        ProductImageNormalizer,
        { provide: OccEndpointsService, useClass: MockOccEndpointsService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    occCartAdapter = TestBed.inject(OccCartAdapter);
    httpMock = TestBed.inject(HttpTestingController);
    converterService = TestBed.inject(ConverterService);
    occEndpointService = TestBed.inject(OccEndpointsService);

    spyOn(converterService, 'pipeable').and.callThrough();
    spyOn(converterService, 'pipeableMany').and.callThrough();
    spyOn(occEndpointService, 'buildUrl').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('load all carts', () => {
    it('should load all carts details data for given user with details flag', () => {
      let result;
      occCartAdapter.loadAll(userId).subscribe((res) => (result = res));

      const mockReq = httpMock.expectOne((req) => {
        return req.method === 'GET' && req.url === 'carts';
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      expect(occEndpointService.buildUrl).toHaveBeenCalledWith('carts', {
        urlParams: {
          userId,
        },
      });
      mockReq.flush(cartDataList);
      expect(result).toEqual(cartDataList.carts);
    });
  });

  describe('load cart data', () => {
    it('should load cart detail data for given userId, cartId', () => {
      let result;
      occCartAdapter.load(userId, cartId).subscribe((res) => (result = res));

      const mockReq = httpMock.expectOne((req) => {
        return req.method === 'GET' && req.url === 'cart';
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      expect(occEndpointService.buildUrl).toHaveBeenCalledWith('cart', {
        urlParams: {
          userId,
          cartId,
        },
      });
      mockReq.flush(cartData);
      expect(result).toEqual(cartData);
    });

    it('should load current cart for given userId', () => {
      let result;
      occCartAdapter
        .load(userId, OCC_CART_ID_CURRENT)
        .subscribe((res) => (result = res));

      const mockReq = httpMock.expectOne((req) => {
        return req.method === 'GET' && req.url === 'carts';
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      expect(occEndpointService.buildUrl).toHaveBeenCalledWith('carts', {
        urlParams: {
          userId,
        },
      });
      mockReq.flush({ carts: [cartData] });
      expect(result).toEqual(cartData);
    });
  });

  describe('create a cart', () => {
    it('should be able to create a new cart for the given user ', () => {
      let result;
      occCartAdapter.create(userId).subscribe((res) => (result = res));

      const mockReq = httpMock.expectOne((req) => {
        return req.method === 'POST' && req.url === 'createCart';
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      expect(occEndpointService.buildUrl).toHaveBeenCalledWith('createCart', {
        urlParams: { userId },
        queryParams: {},
      });
      mockReq.flush(cartData);
      expect(result).toEqual(cartData);
    });
  });

  describe('merge a cart', () => {
    it('should be able to merge a cart to current one for the given user ', () => {
      let result;
      occCartAdapter
        .create(userId, cartId, toMergeCart.guid)
        .subscribe((res) => (result = res));

      const mockReq = httpMock.expectOne((req) => {
        return req.method === 'POST' && req.url === 'createCart';
      });

      expect(occEndpointService.buildUrl).toHaveBeenCalledWith('createCart', {
        urlParams: { userId },
        queryParams: { oldCartId: cartId, toMergeCartGuid: toMergeCart.guid },
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(mergedCart);
      expect(result).toEqual(mergedCart);
    });
  });

  describe('add email to cart', () => {
    it('should be able to assign email to cart for anonymous user', () => {
      const email = 'tester@sap.com';
      let result: Object;

      occCartAdapter
        .addEmail(userId, cartId, email)
        .subscribe((value) => (result = value));

      const mockReq = httpMock.expectOne({ method: 'PUT' });

      expect(mockReq.request.serializeBody()).toEqual(`email=${email}`);

      expect(occEndpointService.buildUrl).toHaveBeenCalledWith('addEmail', {
        urlParams: {
          userId,
          cartId,
        },
      });
      expect(mockReq.cancelled).toBeFalsy();

      mockReq.flush('');
      expect(result).toEqual('');
    });
  });

  describe('delete', () => {
    it('should delete the cart', () => {
      let result: Object;

      occCartAdapter
        .delete(userId, cartId)
        .subscribe((value) => (result = value));

      const mockReq = httpMock.expectOne({
        method: 'DELETE',
        url: 'deleteCart',
      });

      expect(occEndpointService.buildUrl).toHaveBeenCalledWith('deleteCart', {
        urlParams: {
          userId,
          cartId,
        },
      });
      expect(mockReq.cancelled).toBeFalsy();

      mockReq.flush('');
      expect(result).toEqual('');
    });

    it('should add client token if userId is anonymous', () => {
      let result: Object;
      let headers = new HttpHeaders();
      headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);

      occCartAdapter
        .delete(OCC_USER_ID_ANONYMOUS, cartId)
        .subscribe((value) => (result = value));

      const mockReq = httpMock.expectOne({
        method: 'DELETE',
        url: 'deleteCart',
      });

      expect(occEndpointService.buildUrl).toHaveBeenCalledWith('deleteCart', {
        urlParams: {
          userId: OCC_USER_ID_ANONYMOUS,
          cartId,
        },
      });
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.headers).toEqual(headers);

      mockReq.flush('');
      expect(result).toEqual('');
    });
  });

  describe('should save a cart from saveCart endpoint', () => {
    it('should save a cart', () => {
      const mockCartName = 'test-cart-name';
      const mockCartDescription = 'test-cart-description';
      const mockSavedCartResult = {
        savedCartData: {
          name: mockCartName,
          entries: [{ entryNumber: 0, product: { name: 'test-product' } }],
          description: mockCartDescription,
        },
      };

      occCartAdapter
        .save(userId, cartId, mockCartName, mockCartDescription)
        .subscribe((data) =>
          expect(data).toEqual(mockSavedCartResult.savedCartData)
        );

      const mockReq = httpMock.expectOne(
        (req) => req.method === 'PATCH' && req.url === `saveCart`
      );

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(mockSavedCartResult);
      expect(converterService.pipeable).toHaveBeenCalledWith(CART_NORMALIZER);
    });
  });
});
