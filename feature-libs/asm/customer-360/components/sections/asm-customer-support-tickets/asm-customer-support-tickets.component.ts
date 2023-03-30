/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Customer360SupportTicketList } from '@spartacus/asm/customer-360/root';
import { TranslationService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  CustomerTableColumn,
  TableEntry,
} from '../../asm-customer-table/asm-customer-table.model';
import { Customer360SectionContext } from '../customer-360-section-context.model';
import { SupportTicketEntry } from './asm-customer-support-tickets.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cx-asm-customer-support-tickets',
  templateUrl: './asm-customer-support-tickets.component.html',
})
export class AsmCustomerSupportTicketsComponent implements OnInit {
  supportTicketsColumns: Array<CustomerTableColumn> = [
    {
      property: 'id',
      text: 'id',
      i18nTextKey: 'customer360.supportTickets.columnHeaders.id',
      navigatable: true,
    },
    {
      property: 'subject',
      text: 'subject',
      i18nTextKey: 'customer360.supportTickets.columnHeaders.headline',
    },
    {
      property: 'categoryLabel',
      text: 'categoryLabel',
      i18nTextKey: 'customer360.supportTickets.columnHeaders.category',
    },
    {
      property: 'createdAt',
      text: 'created',
      i18nTextKey: 'customer360.activity.created',
      isDate: true,
    },
    {
      property: 'updatedAt',
      text: 'updated',
      i18nTextKey: 'customer360.activity.updated',
      isDate: true,
    },
    {
      property: 'statusLabel',
      text: 'statusLabel',
      i18nTextKey: 'customer360.activity.status',
    },
  ];

  supportTicketsEntries$: Observable<Array<SupportTicketEntry>>;

  constructor(
    protected context: Customer360SectionContext<Customer360SupportTicketList>,
    protected translation: TranslationService
  ) {}

  ngOnInit(): void {
    this.supportTicketsEntries$ = this.context.data$.pipe(
      map((data) => {
        return data.tickets.map((entry) => {
          return {
            ...entry,
            statusLabel: entry.status.name,
            categoryLabel: entry.category.name,
          };
        });
      })
    );
  }
  // Todo: need to navigate to new ticket page
  navigateTo(entry: TableEntry): void {
    if (entry) {
      //
    }
  }
}
