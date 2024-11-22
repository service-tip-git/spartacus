/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  OPF_GOOGLE_PAY_PROVIDER_NAME,
  OpfQuickBuyGooglePayProvider,
} from '../model';
import { OpfQuickBuyConfig } from './opf-quick-buy-config';

export const defaultOpfQuickBuyConfig: OpfQuickBuyConfig = {
  providers: [
    {
      [OPF_GOOGLE_PAY_PROVIDER_NAME]: {
        resourceUrl: '',
      } as OpfQuickBuyGooglePayProvider,
    },
  ],
};
