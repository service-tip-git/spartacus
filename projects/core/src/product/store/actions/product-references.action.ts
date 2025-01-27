/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Action } from '@ngrx/store';
import { ErrorAction } from '../../../error-handling';
import { ProductReference } from '../../../model/product.model';

export const LOAD_PRODUCT_REFERENCES = '[Product] Load Product References Data';
export const LOAD_PRODUCT_REFERENCES_FAIL =
  '[Product] Load Product References Data Fail';
export const LOAD_PRODUCT_REFERENCES_SUCCESS =
  '[Product] Load Product References Data Success';
export const CLEAN_PRODUCT_REFERENCES = '[Product] Clean Product References';

export class LoadProductReferences implements Action {
  readonly type = LOAD_PRODUCT_REFERENCES;

  constructor(
    public payload: {
      productCode: string;
      referenceType?: string;
      pageSize?: number;
    }
  ) {}
}

export class LoadProductReferencesFail implements ErrorAction {
  readonly type = LOAD_PRODUCT_REFERENCES_FAIL;
  public error: any;

  // eslint-disable-next-line @typescript-eslint/unified-signatures
  constructor(payload: any);
  /**
   * @deprecated Please pass the argument `payload` (i.e. the error object).
   *             It will become mandatory along with removing
   *             the feature toggle `ssrStrictErrorHandlingForHttpAndNgrx`.
   */
  constructor();
  constructor(public payload?: any) {
    this.error = payload;
  }
}

export class LoadProductReferencesSuccess implements Action {
  readonly type = LOAD_PRODUCT_REFERENCES_SUCCESS;

  constructor(
    public payload: {
      productCode: string;
      list: ProductReference[];
    }
  ) {}
}

export class CleanProductReferences implements Action {
  readonly type = CLEAN_PRODUCT_REFERENCES;
}

// action types
export type ProductReferencesAction =
  | LoadProductReferences
  | LoadProductReferencesFail
  | LoadProductReferencesSuccess
  | CleanProductReferences;
