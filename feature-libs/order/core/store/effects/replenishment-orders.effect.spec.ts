import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { LoggerService, tryNormalizeHttpError } from '@spartacus/core';
import { ReplenishmentOrderList } from '@spartacus/order/root';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { ReplenishmentOrderHistoryAdapter } from '../../connectors/replenishment-order-history.adapter';
import { ReplenishmentOrderHistoryConnector } from '../../connectors/replenishment-order-history.connector';
import { OrderActions } from '../actions/index';
import * as fromEffect from './replenishment-orders.effect';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

const mockUserReplenishmentOrders: ReplenishmentOrderList = {
  replenishmentOrders: [],
  pagination: {},
  sorts: [],
};

class MockLoggerService {
  log(): void {}
  warn(): void {}
  error(): void {}
  info(): void {}
  debug(): void {}
}

describe('Replenishment Orders effect', () => {
  let userReplenishmentOrdersEffect: fromEffect.ReplenishmentOrdersEffect;
  let replenishmentOrderHistoryConnector: ReplenishmentOrderHistoryConnector;
  let actions$: Observable<Action>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ReplenishmentOrderHistoryConnector,
        fromEffect.ReplenishmentOrdersEffect,
        { provide: ReplenishmentOrderHistoryAdapter, useValue: {} },
        { provide: LoggerService, useClass: MockLoggerService },
        provideMockActions(() => actions$),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    actions$ = TestBed.inject(Actions);
    userReplenishmentOrdersEffect = TestBed.inject(
      fromEffect.ReplenishmentOrdersEffect
    );
    replenishmentOrderHistoryConnector = TestBed.inject(
      ReplenishmentOrderHistoryConnector
    );
  });

  describe('loadUserReplenishmentOrders$', () => {
    it('should load User Replenishment Orders', () => {
      spyOn(replenishmentOrderHistoryConnector, 'loadHistory').and.returnValue(
        of(mockUserReplenishmentOrders)
      );
      const action = new OrderActions.LoadUserReplenishmentOrders({
        userId: 'test@sap.com',
        pageSize: 5,
      });

      const completion = new OrderActions.LoadUserReplenishmentOrdersSuccess(
        mockUserReplenishmentOrders
      );

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(
        userReplenishmentOrdersEffect.loadUserReplenishmentOrders$
      ).toBeObservable(expected);
    });

    it('should handle failures for load user Replenishment Orders', () => {
      const error = new Error('error');
      spyOn(replenishmentOrderHistoryConnector, 'loadHistory').and.returnValue(
        throwError(() => error)
      );

      const action = new OrderActions.LoadUserReplenishmentOrders({
        userId: 'test@sap.com',
        pageSize: 5,
      });

      const completion = new OrderActions.LoadUserReplenishmentOrdersFail(
        tryNormalizeHttpError(error, new MockLoggerService())
      );

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(
        userReplenishmentOrdersEffect.loadUserReplenishmentOrders$
      ).toBeObservable(expected);
    });
  });
});
