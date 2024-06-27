/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActionErrorProperty } from '@spartacus/core';
import { StateUtils } from '../../../state/utils/index';
import { NAVIGATION_DETAIL_ENTITY } from '../cms-state';

export const LOAD_CMS_NAVIGATION_ITEMS = '[Cms] Load NavigationEntry items';
export const LOAD_CMS_NAVIGATION_ITEMS_FAIL =
  '[Cms] Load NavigationEntry items Fail';
export const LOAD_CMS_NAVIGATION_ITEMS_SUCCESS =
  '[Cms] Load NavigationEntry items Success';

export class LoadCmsNavigationItems extends StateUtils.EntityLoadAction {
  readonly type = LOAD_CMS_NAVIGATION_ITEMS;

  constructor(public payload: { nodeId: string; items: any[] }) {
    super(NAVIGATION_DETAIL_ENTITY, payload.nodeId);
  }
}

export class LoadCmsNavigationItemsFail extends StateUtils.EntityFailAction {
  readonly type = LOAD_CMS_NAVIGATION_ITEMS_FAIL;

  /**
   * @deprecated Please use `error` parameter other than `null` or `undefined`.
   *
   *             Note: Allowing for `null` or `undefined` will be removed in future versions
   *             together with the feature toggle `ssrStrictErrorHandlingForHttpAndNgrx`.
   **/
  constructor(nodeId: string, error: null | undefined);
  constructor(
    nodeId: string,
    // eslint-disable-next-line @typescript-eslint/unified-signatures -- for distinguishing non-deprecated constructor
    error: ActionErrorProperty
  );
  constructor(nodeId: string, public error: any) {
    super(NAVIGATION_DETAIL_ENTITY, nodeId, error);
  }
}

export class LoadCmsNavigationItemsSuccess extends StateUtils.EntitySuccessAction {
  readonly type = LOAD_CMS_NAVIGATION_ITEMS_SUCCESS;

  constructor(public payload: { nodeId: string; components: any[] }) {
    super(NAVIGATION_DETAIL_ENTITY, payload.nodeId);
  }
}

// action types
export type CmsNavigationEntryItemAction =
  | LoadCmsNavigationItems
  | LoadCmsNavigationItemsFail
  | LoadCmsNavigationItemsSuccess;
