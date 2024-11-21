/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  B2BUnitNode,
  OrgUnitService,
  UserGroup,
} from '@spartacus/organization/administration/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ItemService } from '../../shared/item.service';
import { createCodeForEntityName } from '../../shared/utility/entity-code';
import { UserGroupItemService } from '../services/user-group-item.service';
import { TranslatePipe } from '@spartacus/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormErrorsComponent } from '@spartacus/storefront';
import { FeatureDirective } from '@spartacus/core';
import { NgIf, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { FormComponent } from '../../shared/form/form.component';

@Component({
  selector: 'cx-org-user-group-form',
  templateUrl: './user-group-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' },
  providers: [
    {
      provide: ItemService,
      useExisting: UserGroupItemService,
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
  ],
})
export class UserGroupFormComponent implements OnInit {
  form: UntypedFormGroup | null = this.itemService.getForm();

  // getList ???
  units$: Observable<B2BUnitNode[] | undefined> = this.unitService
    .getActiveUnitList()
    .pipe(
      tap((units) => {
        if (units && units.length === 1) {
          this.form?.get('orgUnit.uid')?.setValue(units[0]?.id);
        }
      })
    );

  constructor(
    protected itemService: ItemService<UserGroup>,
    protected unitService: OrgUnitService
  ) {}

  ngOnInit(): void {
    this.unitService.loadList();
  }

  createUidWithName(
    name: AbstractControl | null,
    code: AbstractControl | null
  ): void {
    createCodeForEntityName(name, code);
  }
}
