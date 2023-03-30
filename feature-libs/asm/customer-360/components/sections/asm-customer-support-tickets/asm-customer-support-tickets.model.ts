/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Customer360SupportTicket } from '@spartacus/asm/customer-360/root';

export interface SupportTicketEntry extends Customer360SupportTicket {
  categoryLabel?: string;
  statusLabel?: string;
}
