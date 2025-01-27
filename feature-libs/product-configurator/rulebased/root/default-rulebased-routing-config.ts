/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoutingConfig } from '@spartacus/core';

export const defaultRulebasedRoutingConfig: RoutingConfig = {
  routing: {
    routes: {
      configureCPQCONFIGURATOR: {
        paths: ['configure/vc/:ownerType/entityKey/:entityKey'],
      },
      configureCPQCONFIGURATOR_READ_ONLY: {
        paths: [
          'configure-overview/vc/:ownerType/entityKey/:entityKey/displayOnly/true',
        ],
      },
      configureOverviewCPQCONFIGURATOR: {
        paths: [
          'configure-overview/vc/:ownerType/entityKey/:entityKey/displayOnly/:displayOnly',
          'configure-overview/vc/:ownerType/entityKey/:entityKey',
        ],
      },
    },
  },
};
