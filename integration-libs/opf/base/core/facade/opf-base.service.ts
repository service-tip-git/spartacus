/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, inject } from '@angular/core';
import {
  CommandService,
  Query,
  QueryService,
  QueryState,
} from '@spartacus/core';
import {
  OpfActiveConfiguration,
  OpfBaseFacade,
} from '@spartacus/opf/base/root';
import { Observable } from 'rxjs';
import { OpfBaseConnector } from '../connectors/opf-base.connector';

@Injectable()
export class OpfBaseService implements OpfBaseFacade {
  protected queryService = inject(QueryService);
  protected commandService = inject(CommandService);
  protected opfBaseConnector = inject(OpfBaseConnector);

  protected activeConfigurationsQuery: Query<OpfActiveConfiguration[]> =
    this.queryService.create<OpfActiveConfiguration[]>(() =>
      this.opfBaseConnector.getActiveConfigurations()
    );

  getActiveConfigurationsState(): Observable<
    QueryState<OpfActiveConfiguration[] | undefined>
  > {
    return this.activeConfigurationsQuery.getState();
  }
}
