/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSelector, MemoizedSelector } from '@ngrx/store';
import { StateUtils } from '@spartacus/core';
import { Order } from '@spartacus/order/root';
import { OrderState, StateWithOrder } from '../order-state';
import { getOrderState } from './feature.selector';
import { OrderEntryGroup } from '@spartacus/cart/base/root';

export const getOrderDetailState: MemoizedSelector<
  StateWithOrder,
  StateUtils.LoaderState<Order>
> = createSelector(getOrderState, (state: OrderState) => state.orderDetail);

export const getOrderDetails: MemoizedSelector<StateWithOrder, Order> =
  createSelector(getOrderDetailState, (state: StateUtils.LoaderState<Order>) =>
    StateUtils.loaderValueSelector(state)
  );

export const getOrderDetailsLoading: MemoizedSelector<StateWithOrder, boolean> =
  createSelector(getOrderDetailState, (state: StateUtils.LoaderState<Order>) =>
    StateUtils.loaderLoadingSelector(state)
  );

export const getOrderEntryGroups: MemoizedSelector<StateWithOrder, OrderEntryGroup[]> =
  createSelector(getOrderDetails,(state: Order) => {
      return state && state.entryGroups ? state.entryGroups : [];
    }
  );

