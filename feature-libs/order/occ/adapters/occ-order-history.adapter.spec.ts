import {
  HttpRequest,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import {
  ConverterService,
  OccConfig,
  OccEndpointsService,
} from '@spartacus/core';
import {
  CancellationRequestEntryInputList,
  CONSIGNMENT_TRACKING_NORMALIZER,
  ConsignmentTracking,
  Order,
  ORDER_HISTORY_NORMALIZER,
  ORDER_NORMALIZER,
  ORDER_RETURN_REQUEST_INPUT_SERIALIZER,
  ORDER_RETURN_REQUEST_NORMALIZER,
  ORDER_RETURNS_NORMALIZER,
  ReturnRequest,
  ReturnRequestEntryInputList,
} from '@spartacus/order/root';
import {
  MockOccEndpointsService,
  mockOccModuleConfig,
} from 'projects/core/src/occ/adapters/user/unit-test.helper';
import { OccOrderHistoryAdapter } from './occ-order-history.adapter';

const userId = '123';

const orderData: Order = {
  site: 'electronics',
  calculated: true,
  code: '00001004',
};
const consignmentCode = 'a00001004';

const returnRequest: ReturnRequest = { rma: 'test return request' };

describe('OccOrderHistoryAdapter', () => {
  let occOrderHistoryAdapter: OccOrderHistoryAdapter;
  let httpMock: HttpTestingController;
  let converter: ConverterService;
  let occEnpointsService: OccEndpointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OccOrderHistoryAdapter,
        { provide: OccConfig, useValue: mockOccModuleConfig },
        {
          provide: OccEndpointsService,
          useClass: MockOccEndpointsService,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    occOrderHistoryAdapter = TestBed.inject(OccOrderHistoryAdapter);
    httpMock = TestBed.inject(HttpTestingController);
    converter = TestBed.inject(ConverterService);
    occEnpointsService = TestBed.inject(OccEndpointsService);
    spyOn(converter, 'pipeable').and.callThrough();
    spyOn(converter, 'convert').and.callThrough();
    spyOn(occEnpointsService, 'buildUrl').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getUserOrders', () => {
    it('should fetch user Orders with default options', waitForAsync(() => {
      const PAGE_SIZE = 5;
      occOrderHistoryAdapter.loadHistory(userId, PAGE_SIZE).subscribe();
      httpMock.expectOne((req: HttpRequest<any>) => {
        return req.method === 'GET';
      }, `GET method and url`);
      expect(occEnpointsService.buildUrl).toHaveBeenCalledWith('orderHistory', {
        urlParams: { userId },
        queryParams: { pageSize: PAGE_SIZE.toString() },
      });
    }));

    it('should fetch user Orders with defined options', waitForAsync(() => {
      const PAGE_SIZE = 5;
      const currentPage = 1;
      const sort = 'byDate';

      occOrderHistoryAdapter
        .loadHistory(userId, PAGE_SIZE, currentPage, sort)
        .subscribe();
      httpMock.expectOne((req: HttpRequest<any>) => {
        return req.method === 'GET';
      }, `GET method`);
      expect(occEnpointsService.buildUrl).toHaveBeenCalledWith('orderHistory', {
        urlParams: { userId },
        queryParams: {
          pageSize: PAGE_SIZE.toString(),
          currentPage: currentPage.toString(),
          sort,
        },
      });
    }));

    it('should use converter', () => {
      occOrderHistoryAdapter.loadHistory(userId).subscribe();
      httpMock
        .expectOne((req: HttpRequest<any>) => {
          return req.method === 'GET';
        }, `GET method`)
        .flush({});
      expect(converter.pipeable).toHaveBeenCalledWith(ORDER_HISTORY_NORMALIZER);
    });
  });

  describe('getOrder', () => {
    it('should fetch a single order', waitForAsync(() => {
      occOrderHistoryAdapter.load(userId, orderData.code).subscribe();
      httpMock.expectOne((req: HttpRequest<any>) => {
        return req.method === 'GET';
      }, `GET a single order`);
      expect(occEnpointsService.buildUrl).toHaveBeenCalledWith('orderDetail', {
        urlParams: { userId, orderId: orderData.code },
      });
    }));

    it('should use converter', () => {
      occOrderHistoryAdapter.load(userId, orderData.code).subscribe();
      httpMock.expectOne((req) => req.method === 'GET').flush({});
      expect(converter.pipeable).toHaveBeenCalledWith(ORDER_NORMALIZER);
    });
  });

  describe('getConsignmentTracking', () => {
    it('should fetch a consignment tracking', waitForAsync(() => {
      const tracking: ConsignmentTracking = {
        trackingID: '1234567890',
        trackingEvents: [],
      };
      occOrderHistoryAdapter
        .getConsignmentTracking(orderData.code, consignmentCode, userId)
        .subscribe((result) => expect(result).toEqual(tracking));
      const mockReq = httpMock.expectOne((req) => {
        return req.method === 'GET';
      }, `GET a consignment tracking`);
      expect(occEnpointsService.buildUrl).toHaveBeenCalledWith(
        'consignmentTracking',
        {
          urlParams: { userId, orderCode: orderData.code, consignmentCode },
        }
      );
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(tracking);
    }));

    it('should use converter', () => {
      occOrderHistoryAdapter
        .getConsignmentTracking(orderData.code, consignmentCode, userId)
        .subscribe();
      httpMock
        .expectOne((req) => {
          return req.method === 'GET';
        })
        .flush({});
      expect(converter.pipeable).toHaveBeenCalledWith(
        CONSIGNMENT_TRACKING_NORMALIZER
      );
    });
  });

  describe('cancel', () => {
    it('should be able to cancel an order', waitForAsync(() => {
      const cancelRequestInput: CancellationRequestEntryInputList = {
        cancellationRequestEntryInputs: [{ orderEntryNumber: 0, quantity: 1 }],
      };

      let result;
      occOrderHistoryAdapter
        .cancel(userId, orderData.code, cancelRequestInput)
        .subscribe((res) => (result = res));

      const mockReq = httpMock.expectOne((req) => {
        return req.method === 'POST';
      });
      expect(occEnpointsService.buildUrl).toHaveBeenCalledWith('cancelOrder', {
        urlParams: { userId, orderId: orderData.code },
      });
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush({});
      expect(result).toEqual({});
    }));
  });

  describe('createReturnRequest', () => {
    it('should be able to create an order return request', waitForAsync(() => {
      const returnRequestInput: ReturnRequestEntryInputList = {
        orderCode: orderData.code,
        returnRequestEntryInputs: [{ orderEntryNumber: 0, quantity: 1 }],
      };

      let result;
      occOrderHistoryAdapter
        .createReturnRequest(userId, returnRequestInput)
        .subscribe((res) => (result = res));

      const mockReq = httpMock.expectOne((req) => {
        return req.method === 'POST';
      });
      expect(occEnpointsService.buildUrl).toHaveBeenCalledWith('returnOrder', {
        urlParams: { userId },
      });
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(returnRequest);
      expect(result).toEqual(returnRequest);
      expect(converter.convert).toHaveBeenCalledWith(
        returnRequestInput,
        ORDER_RETURN_REQUEST_INPUT_SERIALIZER
      );
    }));

    it('should use converter', () => {
      const returnRequestInput: ReturnRequestEntryInputList = {};
      occOrderHistoryAdapter
        .createReturnRequest(userId, returnRequestInput)
        .subscribe();
      httpMock
        .expectOne((req) => {
          return req.method === 'POST';
        })
        .flush({});
      expect(converter.pipeable).toHaveBeenCalledWith(
        ORDER_RETURN_REQUEST_NORMALIZER
      );
    });
  });

  describe('loadReturnRequestList', () => {
    it('should fetch order return request list with default options', waitForAsync(() => {
      occOrderHistoryAdapter.loadReturnRequestList(userId).subscribe();
      httpMock.expectOne((req: HttpRequest<any>) => {
        return req.method === 'GET';
      });
      expect(occEnpointsService.buildUrl).toHaveBeenCalledWith('orderReturns', {
        urlParams: { userId },
        queryParams: {},
      });
    }));

    it('should fetch user order return request list with defined options', waitForAsync(() => {
      const PAGE_SIZE = 5;
      const currentPage = 1;
      const sort = 'byDate';

      occOrderHistoryAdapter
        .loadReturnRequestList(userId, PAGE_SIZE, currentPage, sort)
        .subscribe();
      httpMock.expectOne((req: HttpRequest<any>) => {
        return req.method === 'GET';
      });
      expect(occEnpointsService.buildUrl).toHaveBeenCalledWith('orderReturns', {
        urlParams: { userId },
        queryParams: {
          pageSize: PAGE_SIZE.toString(),
          currentPage: currentPage.toString(),
          sort,
        },
      });
    }));

    it('should use converter', () => {
      occOrderHistoryAdapter.loadReturnRequestList(userId).subscribe();
      httpMock
        .expectOne((req: HttpRequest<any>) => {
          return req.method === 'GET';
        })
        .flush({});
      expect(converter.pipeable).toHaveBeenCalledWith(ORDER_RETURNS_NORMALIZER);
    });
  });

  describe('loadReturnRequestDetail', () => {
    it('should be able to load an order return request data', waitForAsync(() => {
      let result;
      occOrderHistoryAdapter
        .loadReturnRequestDetail(userId, 'test')
        .subscribe((res) => (result = res));

      const mockReq = httpMock.expectOne((req) => {
        return req.method === 'GET';
      });
      expect(occEnpointsService.buildUrl).toHaveBeenCalledWith(
        'orderReturnDetail',
        {
          urlParams: { userId, returnRequestCode: 'test' },
        }
      );
      expect(mockReq.cancelled).toBeFalsy();
      mockReq.flush({});
      expect(result).toEqual({});
    }));

    it('should use converter', () => {
      occOrderHistoryAdapter
        .loadReturnRequestDetail(userId, 'test')
        .subscribe();
      httpMock
        .expectOne((req) => {
          return req.method === 'GET';
        })
        .flush({});
      expect(converter.pipeable).toHaveBeenCalledWith(
        ORDER_RETURN_REQUEST_NORMALIZER
      );
    });
  });

  describe('cancelReturnRequest', () => {
    it('should be able to cancel one return request', waitForAsync(() => {
      let result;
      occOrderHistoryAdapter
        .cancelReturnRequest(userId, 'returnCode', { status: 'CANCELLING' })
        .subscribe((res) => (result = res));

      const mockReq = httpMock.expectOne((req) => {
        return req.method === 'PATCH';
      });
      expect(occEnpointsService.buildUrl).toHaveBeenCalledWith('cancelReturn', {
        urlParams: { userId, returnRequestCode: 'returnCode' },
      });
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush({});
      expect(result).toEqual({});
    }));
  });
});
