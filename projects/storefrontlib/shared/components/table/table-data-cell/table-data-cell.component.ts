/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { OutletContextData } from '../../../../cms-structure/outlet/outlet.model';
import { TableHeaderOutletContext } from '../table.model';

@Component({
  selector: 'cx-table-data-cell',
  template: `{{ value }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TableDataCellComponent {
  constructor(protected outlet: OutletContextData<TableHeaderOutletContext>) {}

  @HostBinding('attr.title')
  get value(): string {
    return this.model[this.field];
  }

  protected get model(): any {
    return this.outlet?.context;
  }

  protected get field(): string {
    return this.outlet?.context?._field;
  }
}
