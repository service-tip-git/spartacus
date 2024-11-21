/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  AbstractControl,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CostCenter, Currency, CurrencyService } from '@spartacus/core';
import {
  B2BUnitNode,
  OrgUnitService,
} from '@spartacus/organization/administration/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CurrentItemService } from '../../shared/current-item.service';
import { ItemService } from '../../shared/item.service';
import { createCodeForEntityName } from '../../shared/utility/entity-code';
import { CostCenterItemService } from '../services/cost-center-item.service';
import { CurrentCostCenterService } from '../services/current-cost-center.service';
import { TranslatePipe } from '@spartacus/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormErrorsComponent } from '@spartacus/storefront';
import { FeatureDirective } from '@spartacus/core';
import { NgIf, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { FormComponent } from '../../shared/form/form.component';

@Component({
  selector: 'cx-org-cost-center-form',
  templateUrl: './cost-center-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' },
  providers: [
    {
      provide: ItemService,
      useExisting: CostCenterItemService,
    },
    {
      provide: CurrentItemService,
      useExisting: CurrentCostCenterService,
    },
  ],
  standalone: true,
  imports: [
    FormComponent,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    FeatureDirective,
    NgTemplateOutlet,
    FormErrorsComponent,
    NgSelectModule,
    AsyncPipe,
    TranslatePipe,
    TranslatePipe,
  ],
})
export class CostCenterFormComponent {
  form: UntypedFormGroup | null = this.itemService.getForm();
  /**
   * Initialize the business unit for the cost center.
   *
   * If there's a unit provided, we disable the form control.
   */
  @Input() set unitKey(value: string | null) {
    if (value) {
      this.form?.get('unit.uid')?.setValue(value);
      this.form?.get('unit')?.disable();
    }
  }

  units$: Observable<B2BUnitNode[] | undefined> = this.unitService
    .getActiveUnitList()
    .pipe(
      tap((units) => {
        if (units && units.length === 1) {
          this.form?.get('unit.uid')?.setValue(units[0]?.id);
        }
      })
    );

  currencies$: Observable<Currency[]> = this.currencyService.getAll().pipe(
    tap((currency) => {
      if (currency.length === 1) {
        this.form?.get('currency.isocode')?.setValue(currency[0]?.isocode);
      }
    })
  );

  constructor(
    protected itemService: ItemService<CostCenter>,
    protected unitService: OrgUnitService,
    protected currencyService: CurrencyService
  ) {}

  createCodeWithName(
    name: AbstractControl | null,
    code: AbstractControl | null
  ): void {
    createCodeForEntityName(name, code);
  }
}
