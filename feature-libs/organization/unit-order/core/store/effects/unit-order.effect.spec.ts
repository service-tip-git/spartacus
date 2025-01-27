import {
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { SiteContextActions, tryNormalizeHttpError } from '@spartacus/core';
import { Order, OrderHistoryList } from '@spartacus/order/root';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { UnitOrderAdapter, UnitOrderConnector } from '../../connectors/index';
import { UnitOrderActions } from '../actions/index';
import { UnitOrderEffect } from './unit-order.effect';

const mockOrderDetails: Order = {};

const mockOrderDetailsParams = {
  userId: 'user15355363988711@ydev.hybris.com',
  orderCode: '00000386',
};

const mockUserOrders: OrderHistoryList = {
  orders: [],
  pagination: {},
  sorts: [],
};

const mockError = new HttpErrorResponse({ error: 'test-error' });

class MockLoggerService {
  log(): void {}
  warn(): void {}
  error(): void {}
  info(): void {}
  debug(): void {}
}

describe('Orders effect', () => {
  let ordersEffect: UnitOrderEffect;
  let orderHistoryConnector: UnitOrderConnector;
  let actions$: Observable<Action>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        UnitOrderConnector,
        UnitOrderEffect,
        { provide: UnitOrderAdapter, useValue: {} },
        provideMockActions(() => actions$),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    actions$ = TestBed.inject(Actions);
    ordersEffect = TestBed.inject(UnitOrderEffect);
    orderHistoryConnector = TestBed.inject(UnitOrderConnector);
  });

  describe('loadUnitOrders$', () => {
    describe('Unit Order History', () => {
      it('should load unit Orders', () => {
        spyOn(orderHistoryConnector, 'getUnitOrderHistory').and.returnValue(
          of(mockUserOrders)
        );

        const action = new UnitOrderActions.LoadUnitOrders({
          userId: 'test@sap.com',
          pageSize: 5,
        });

        const completion = new UnitOrderActions.LoadUnitOrdersSuccess(
          mockUserOrders
        );
        actions$ = hot('-a', { a: action });

        const expected = cold('-b', { b: completion });

        expect(ordersEffect.loadUnitOrders$).toBeObservable(expected);
      });

      it('should handle failures for load user Orders', () => {
        spyOn(orderHistoryConnector, 'getUnitOrderHistory').and.returnValue(
          throwError(() => mockError)
        );

        const action = new UnitOrderActions.LoadUnitOrders({
          userId: 'test@sap.com',
          pageSize: 5,
        });

        const completion = new UnitOrderActions.LoadUnitOrdersFail(
          tryNormalizeHttpError(mockError, new MockLoggerService())
        );
        actions$ = hot('-a', { a: action });

        const expected = cold('-b', { b: completion });

        expect(ordersEffect.loadUnitOrders$).toBeObservable(expected);
      });
    });

    describe('resetUnitOrders$', () => {
      it('should return a reset action', () => {
        const action = new SiteContextActions.LanguageChange({
          previous: 'previous',
          current: 'current',
        });

        const completion = new UnitOrderActions.ClearUnitOrders();

        actions$ = hot('-a', { a: action });
        const expected = cold('-b', { b: completion });

        expect(ordersEffect.resetUserOrders$).toBeObservable(expected);
      });
    });

    describe('loadOrderDetails$', () => {
      it('should load order details', () => {
        spyOn(orderHistoryConnector, 'getUnitOrderDetail').and.returnValue(
          of(mockOrderDetails)
        );
        const action = new UnitOrderActions.LoadOrderDetails(
          mockOrderDetailsParams
        );

        const completion = new UnitOrderActions.LoadOrderDetailsSuccess(
          mockOrderDetails
        );

        actions$ = hot('-a', { a: action });
        const expected = cold('-b', { b: completion });

        expect(ordersEffect.loadOrderDetails$).toBeObservable(expected);
      });

      it('should handle failures for load order details', () => {
        const mockNormalizedError = tryNormalizeHttpError(
          mockError,
          new MockLoggerService()
        );
        spyOn(orderHistoryConnector, 'getUnitOrderDetail').and.returnValue(
          throwError(() => mockError)
        );

        const action = new UnitOrderActions.LoadOrderDetails(
          mockOrderDetailsParams
        );

        const completion = new UnitOrderActions.LoadOrderDetailsFail(
          mockNormalizedError
        );

        actions$ = hot('-a', { a: action });
        const expected = cold('-b', { b: completion });

        expect(ordersEffect.loadOrderDetails$).toBeObservable(expected);
      });
    });
  });
});
