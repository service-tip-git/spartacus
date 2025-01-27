import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  LoggerService,
  OccConfig,
  tryNormalizeHttpError,
} from '@spartacus/core';
import { Order } from '@spartacus/order/root';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { OrderHistoryAdapter, OrderHistoryConnector } from '../../connectors';
import { OrderActions } from '../actions';
import { OrderByIdEffect } from './order-by-id.effect';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
const mockOrder: Order = { code: 'order1', status: 'shipped' };

const mockOrderParams = {
  userId: 'user',
  code: 'order1',
};

const MockOccModuleConfig: OccConfig = {
  backend: {
    occ: {
      baseUrl: '',
      prefix: '',
    },
  },
};

class MockLoggerService {
  log(): void {}
  warn(): void {}
  error(): void {}
  info(): void {}
  debug(): void {}
}

describe('Order By Id effect', () => {
  let effect: OrderByIdEffect;
  let orderHistoryConnector: OrderHistoryConnector;
  let actions$: Observable<any>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        OrderHistoryConnector,
        OrderByIdEffect,
        { provide: OccConfig, useValue: MockOccModuleConfig },
        { provide: OrderHistoryAdapter, useValue: {} },
        provideMockActions(() => actions$),
        { provide: LoggerService, useClass: MockLoggerService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    actions$ = TestBed.inject(Actions);
    effect = TestBed.inject(OrderByIdEffect);
    orderHistoryConnector = TestBed.inject(OrderHistoryConnector);
  });

  describe('loadOrderById$', () => {
    it('should load order by id', () => {
      spyOn(orderHistoryConnector, 'get').and.returnValue(of(mockOrder));
      const action = new OrderActions.LoadOrderById(mockOrderParams);

      const completion = new OrderActions.LoadOrderByIdSuccess(mockOrder);

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effect.loadOrderById$).toBeObservable(expected);
    });

    it('should handle failures for load order by id', () => {
      const error = new Error('error');
      spyOn(orderHistoryConnector, 'get').and.returnValue(
        throwError(() => error)
      );

      const action = new OrderActions.LoadOrderById(mockOrderParams);

      const completion = new OrderActions.LoadOrderByIdFail({
        code: mockOrderParams.code,
        error: tryNormalizeHttpError(error, new MockLoggerService()),
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effect.loadOrderById$).toBeObservable(expected);
    });
  });
});
