/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ErrorAction,
  GeoPoint,
  SearchConfig,
  StateUtils,
} from '@spartacus/core';
import { STORE_FINDER_DATA } from '../store-finder-state';

export const FIND_STORES_ON_HOLD = '[StoreFinder] On Hold';
export const FIND_STORES = '[StoreFinder] Find Stores';
export const FIND_STORES_FAIL = '[StoreFinder] Find Stores Fail';
export const FIND_STORES_SUCCESS = '[StoreFinder] Find Stores Success';

export const FIND_STORE_BY_ID = '[StoreFinder] Find a Store by Id';
export const FIND_STORE_BY_ID_FAIL = '[StoreFinder] Find a Store by Id Fail';
export const FIND_STORE_BY_ID_SUCCESS =
  '[StoreFinder] Find a Store by Id Success';

export class FindStoresOnHold extends StateUtils.LoaderLoadAction {
  readonly type = FIND_STORES_ON_HOLD;

  constructor() {
    super(STORE_FINDER_DATA);
  }
}

export class FindStores extends StateUtils.LoaderLoadAction {
  readonly type = FIND_STORES;

  constructor(
    public payload: {
      queryText: string;
      searchConfig?: SearchConfig;
      longitudeLatitude?: GeoPoint;
      useMyLocation?: boolean;
      countryIsoCode?: string;
      radius?: number;
    }
  ) {
    super(STORE_FINDER_DATA);
  }
}

export class FindStoresFail
  extends StateUtils.LoaderFailAction
  implements ErrorAction
{
  readonly type = FIND_STORES_FAIL;

  constructor(public payload: any) {
    super(STORE_FINDER_DATA, payload);
  }
}

export class FindStoresSuccess extends StateUtils.LoaderSuccessAction {
  readonly type = FIND_STORES_SUCCESS;

  constructor(public payload: any) {
    super(STORE_FINDER_DATA);
  }
}

export class FindStoreById extends StateUtils.LoaderLoadAction {
  readonly type = FIND_STORE_BY_ID;

  constructor(public payload: { storeId: string }) {
    super(STORE_FINDER_DATA);
  }
}

export class FindStoreByIdFail
  extends StateUtils.LoaderFailAction
  implements ErrorAction
{
  readonly type = FIND_STORE_BY_ID_FAIL;

  constructor(public payload: any) {
    super(STORE_FINDER_DATA, payload);
  }
}

export class FindStoreByIdSuccess extends StateUtils.LoaderSuccessAction {
  readonly type = FIND_STORE_BY_ID_SUCCESS;

  constructor(public payload: any) {
    super(STORE_FINDER_DATA);
  }
}

export type FindStoresAction =
  | FindStoresOnHold
  | FindStores
  | FindStoresFail
  | FindStoresSuccess
  | FindStoreById
  | FindStoreByIdFail
  | FindStoreByIdSuccess;
