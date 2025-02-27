/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Observable } from 'rxjs';
import { StrategyProducts } from '../../model/strategy-products.model';
import { StrategyRequest } from './../../../cds-models/cds-strategy-request.model';

export abstract class MerchandisingStrategyAdapter {
  /**
   * Load products for a given merchandising strategy
   *
   * @param strategyId the id of the merchandising strategy to load products for
   */
  abstract loadProductsForStrategy(
    strategyId: string,
    strategyRequest?: StrategyRequest
  ): Observable<StrategyProducts>;
}
