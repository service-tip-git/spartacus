/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export const enum ProductScope {
  LIST = 'list',
  DETAILS = 'details',
  ATTRIBUTES = 'attributes',
  VARIANTS = 'variants',
  CODE = 'code',
  PRICE = 'price',
  /** Fetch the default stock information. */
  STOCK = 'stock',
  UNIT = 'unit',
  PROMOTIONS = 'promotions',
  LIST_ITEM = 'list_item',
  MULTI_DIMENSIONAL = 'multi_dimensional',
  MULTI_DIMENSIONAL_AVAILABILITY = 'multi_dimensional_availability',
}
