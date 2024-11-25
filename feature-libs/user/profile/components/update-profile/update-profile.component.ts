/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  Optional,
  inject,
} from '@angular/core';
import {
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Title } from '@spartacus/user/profile/root';
import { Observable } from 'rxjs';
import { UpdateProfileComponentService } from './update-profile-component.service';
import { RoutingService } from '@spartacus/core';
import { NgIf, NgFor, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '@spartacus/storefront';
import { FeatureDirective } from '@spartacus/core';
import { NgSelectComponent, NgOptionComponent } from '@ng-select/ng-select';
import { NgSelectA11yDirective } from '@spartacus/storefront';
import { FormErrorsComponent } from '@spartacus/storefront';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';

@Component({
  selector: 'cx-update-profile',
  templateUrl: './update-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'user-form' },
  imports: [
    NgIf,
    SpinnerComponent,
    FeatureDirective,
    FormsModule,
    ReactiveFormsModule,
    NgSelectComponent,
    NgSelectA11yDirective,
    NgFor,
    NgOptionComponent,
    NgTemplateOutlet,
    FormErrorsComponent,
    RouterLink,
    AsyncPipe,
    TranslatePipe,
    UrlPipe,
  ],
})
export class UpdateProfileComponent {
  @Optional() protected routingService = inject(RoutingService, {
    optional: true,
  });

  constructor(protected service: UpdateProfileComponentService) {}

  form: UntypedFormGroup = this.service.form;
  isUpdating$ = this.service.isUpdating$;
  titles$: Observable<Title[]> = this.service.titles$;

  onSubmit(): void {
    this.service.updateProfile();
  }

  navigateTo(cxRoute: string): void {
    this.routingService?.go({ cxRoute });
  }
}
