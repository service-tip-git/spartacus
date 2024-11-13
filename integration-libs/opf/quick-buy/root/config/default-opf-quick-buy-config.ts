/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { GooglePayOpfQuickBuyProvider } from '../model';
import { OpfQuickBuyConfig } from './opf-quick-buy-config';

export const defaultOpfQuickBuyConfig: OpfQuickBuyConfig = {
  providers: [
    {
      googlePay: {
        resourceUrl: '',
      },
    } as GooglePayOpfQuickBuyProvider,
  ],
};
