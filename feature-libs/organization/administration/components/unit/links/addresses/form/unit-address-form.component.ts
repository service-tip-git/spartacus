/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Address, B2BUnit, Country, Region, Title } from '@spartacus/core';
import { Observable } from 'rxjs';
import { ItemService } from '../../../../shared/item.service';
import { CurrentUnitService } from '../../../services/current-unit.service';
import { UnitAddressItemService } from '../services/unit-address-item.service';
import { UnitAddressFormService } from './unit-address-form.service';

@Component({
  selector: 'cx-org-unit-address-form',
  templateUrl: './unit-address-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' },
  providers: [
    {
      provide: ItemService,
      useExisting: UnitAddressItemService,
    },
  ],
  standalone: false,
})
export class UnitAddressFormComponent implements OnInit {
  form: UntypedFormGroup | null = this.itemService.getForm();

  key$ = this.itemService.key$;
  countries$: Observable<Country[]> = this.formService.getCountries();
  titles$: Observable<Title[]> = this.formService.getTitles();
  regions$: Observable<Region[]> = this.formService.getRegions();

  unit$: Observable<B2BUnit | undefined> = this.currentUnitService.item$;

  constructor(
    protected itemService: ItemService<Address>,
    protected formService: UnitAddressFormService,
    protected currentUnitService: CurrentUnitService
  ) {}

  /* eslint @angular-eslint/no-empty-lifecycle-method: 1 */
  ngOnInit(): void {
    // Intentional empty method
  }
}
