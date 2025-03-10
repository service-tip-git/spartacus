/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OccEndpoint } from '@spartacus/core';

declare module '@spartacus/core' {
  interface OccEndpoints {
    /**
     * Endpoint for order approvals
     *
     * @member {string}
     */
    orderApprovals?: string | OccEndpoint;
    /**
     * Endpoint for order approval
     *
     * @member {string}
     */
    orderApproval?: string | OccEndpoint;
    /**
     * Endpoint for order approval decision
     *
     * @member {string}
     */
    orderApprovalDecision?: string | OccEndpoint;
  }
}
