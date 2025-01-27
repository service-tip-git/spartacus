/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CartConfig } from './cart-config';

export const defaultCartConfig: CartConfig = {
  cart: {
    validation: {
      enabled: false,
    },
    selectiveCart: {
      enabled: false,
    },
  },
};
