/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Observable } from 'rxjs';
import { OrderEntry } from '../models/cart.model';

/**
 * An interface for context which determinate export products source
 */
export interface GetOrderEntriesContext {
  /**
   * Retrieve order entries from context source for export action.
   *
   * @returns {Observable<OrderEntry[]>}
   */
  getEntries(): Observable<OrderEntry[]>;
}
