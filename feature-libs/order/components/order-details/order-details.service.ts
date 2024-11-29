/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { OrderEntry, OrderEntryGroup } from '@spartacus/cart/base/root';
import { RoutingService } from '@spartacus/core';
import { Order, OrderHistoryFacade } from '@spartacus/order/root';
import { Observable } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailsService {
  orderCode$: Observable<string>;
  orderLoad$: Observable<{}>;

  constructor(
    private orderHistoryFacade: OrderHistoryFacade,
    private routingService: RoutingService
  ) {
    this.orderCode$ = this.routingService.getRouterState().pipe(
      map((routingData) => routingData.state.params.orderCode),
      distinctUntilChanged()
    );

    this.orderLoad$ = this.orderCode$.pipe(
      tap((orderCode) => {
        if (orderCode) {
          this.orderHistoryFacade.loadOrderDetails(orderCode);
        } else {
          this.orderHistoryFacade.clearOrderDetails();
        }
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  isOrderDetailsLoading(): Observable<boolean> {
    return this.orderHistoryFacade.getOrderDetailsLoading();
  }

  getOrderDetails(): Observable<Order> {
    return this.orderLoad$.pipe(
      switchMap(() => this.orderHistoryFacade.getOrderDetails())
    );
  }

  getEntryGroups(): Observable<OrderEntryGroup[]> {
    return this.orderCode$.pipe(
      switchMap(() => this.orderHistoryFacade.getEntryGroups()),
      distinctUntilChanged()
    );
  }

/**
 * Return order's pickup entry groups
 */
  getPickupEntryGroups(): Observable<OrderEntryGroup[]> {
    return this.getFilteredEntryGroups(
      (entry) => entry.deliveryPointOfService !== undefined
    );
  }
  /**
   * Return order's delivery entry groups
   */
  getDeliveryEntryGroups(): Observable<OrderEntryGroup[]> {
    return this.getFilteredEntryGroups(
      (entry) => entry.deliveryPointOfService === undefined
    );
  }

  /**
   * Return order's entry groups based on a filter condition
   * @param predicate - Function to determine the filtering condition for entries
   */
    private getFilteredEntryGroups(
      predicate: (entry: OrderEntry) => boolean
    ): Observable<OrderEntryGroup[]> {
      return this.getEntryGroups().pipe(
        map((entryGroups) => {
          function traverse(groups: OrderEntryGroup[]): OrderEntryGroup[] {
            const localResult: OrderEntryGroup[] = [];

            for (const group of groups) {
              const newGroup = { ...group };
              const hasMatchingEntry = group.entries?.some(predicate);

              if (hasMatchingEntry) {
                localResult.push(newGroup);
              }

              if (group.entryGroups && group.entryGroups.length > 0) {
                const childGroups = traverse(group.entryGroups);
                if (childGroups.length > 0) {
                  newGroup.entryGroups = childGroups;
                  localResult.push(newGroup);
                }
              }
            }
            return localResult;
          }
          return traverse(entryGroups);
        })
      );
    }
}
