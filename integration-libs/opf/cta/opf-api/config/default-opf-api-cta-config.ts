/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OpfApiConfig } from '@spartacus/opf/base/root';

export const defaultOpfApiCtaConfig: OpfApiConfig = {
  backend: {
    opfApi: {
      endpoints: {
        getCtaScripts: 'payments/cta-scripts-rendering',
      },
    },
  },
};
