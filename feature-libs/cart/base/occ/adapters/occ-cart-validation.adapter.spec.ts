import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CART_VALIDATION_NORMALIZER } from '@spartacus/cart/base/core';
import { CartModificationList } from '@spartacus/cart/base/root';
import {
  BaseOccUrlProperties,
  ConverterService,
  DynamicAttributes,
  OccEndpointsService,
} from '@spartacus/core';
import { OccCartValidationAdapter } from './occ-cart-validation.adapter';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

const mockUserId = 'userId';
const mockCartId = 'cartId';
const mockResponse: CartModificationList = {
  cartModifications: [],
};

export class MockOccEndpointsService implements Partial<OccEndpointsService> {
  buildUrl(
    endpoint: string,
    _attributes?: DynamicAttributes,
    _propertiesToOmit?: BaseOccUrlProperties
  ) {
    return this.getEndpoint(endpoint);
  }
  getEndpoint(endpoint: string) {
    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }
    return endpoint;
  }
  getBaseUrl() {
    return '';
  }
  isConfigured() {
    return true;
  }
}

describe('OccCartValidationAdapter', () => {
  let occCartValidationAdapter: OccCartValidationAdapter;
  let httpMock: HttpTestingController;
  let converter: ConverterService;
  let occEndpointsService: OccEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        OccCartValidationAdapter,
        {
          provide: OccEndpointsService,
          useClass: MockOccEndpointsService,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    occCartValidationAdapter = TestBed.inject(OccCartValidationAdapter);
    httpMock = TestBed.inject(HttpTestingController);
    converter = TestBed.inject(ConverterService);
    occEndpointsService = TestBed.inject(OccEndpointsService);
    spyOn(converter, 'convert').and.callThrough();
    spyOn(converter, 'pipeable').and.callThrough();
    spyOn(occEndpointsService, 'buildUrl').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return cart modification list based on provided params', () => {
    occCartValidationAdapter.validate(mockCartId, mockUserId).subscribe();

    const mockReq = httpMock.expectOne((req) => {
      return req.method === 'POST';
    });

    expect(occEndpointsService.buildUrl).toHaveBeenCalledWith('validate', {
      urlParams: { cartId: mockCartId, userId: mockUserId },
    });

    expect(mockReq.cancelled).toBeFalsy();
    expect(mockReq.request.responseType).toEqual('json');
    mockReq.flush(mockResponse);
  });

  it('should use converter', () => {
    occCartValidationAdapter.validate(mockCartId, mockUserId).subscribe();
    httpMock
      .expectOne((req) => {
        return req.method === 'POST';
      })
      .flush(mockResponse);
    expect(converter.pipeable).toHaveBeenCalledWith(CART_VALIDATION_NORMALIZER);
  });
});
