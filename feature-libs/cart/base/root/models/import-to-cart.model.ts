/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProductData = {
  productCode: string;
  quantity: number;
};

export enum ProductImportStatus {
  SUCCESS = 'success',
  LOW_STOCK = 'lowStock',
  NO_STOCK = 'noStock',
  UNKNOWN_IDENTIFIER = 'unknownIdentifier',
  UNKNOWN_ERROR = 'unknownError',
  LIMIT_EXCEEDED = 'limitExceeded',
}

export interface ProductImportInfo {
  productCode: string;
  statusCode: ProductImportStatus;
  productName?: string;
  quantity?: number;
  quantityAdded?: number;
}

export interface ProductImportSummary {
  loading: boolean;
  cartName: string | undefined;
  count: number;
  total: number;
  successesCount: number;
  warningMessages: ProductImportInfo[];
  errorMessages: ProductImportInfo[];
}
