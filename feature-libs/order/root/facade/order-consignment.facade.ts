/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { facadeFactory } from '@spartacus/core';
import { ORDER_CORE_FEATURE } from '../feature-name';
import { Order } from '../model/order.model';
import { Consignment } from '@spartacus/order/root';

@Injectable({
  providedIn: 'root',
  useFactory: () =>
    facadeFactory({
      facade: OrderConsignmentFacade,
      feature: ORDER_CORE_FEATURE,
      methods: [
        'assignEntryGroupsToConsignments',
      ],
    }),
})
export abstract class OrderConsignmentFacade {
  /**
   * Associates entry groups from the order with corresponding consignments.
   *
   * @param order The order containing the entry groups.
   * @param consignments The list of consignments to be enriched with entry groups.
   * @returns An updated list of consignments, each containing its related entry groups.
   */
  abstract assignEntryGroupsToConsignments(order: Order, consignments: Consignment[]): Consignment[];
}
