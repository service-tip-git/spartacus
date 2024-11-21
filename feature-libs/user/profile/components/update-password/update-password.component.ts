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
import { RoutingService, useFeatureStyles } from '@spartacus/core';
import { Observable } from 'rxjs';
import { UpdatePasswordComponentService } from './update-password-component.service';
import { TranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { RouterLink } from '@angular/router';
import { FormErrorsComponent } from '@spartacus/storefront';
import { PasswordVisibilityToggleDirective } from '@spartacus/storefront';
import { FeatureDirective } from '@spartacus/core';
import { SpinnerComponent } from '@spartacus/storefront';
import { NgIf, NgTemplateOutlet, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-update-password',
  templateUrl: './update-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'user-form' },
  standalone: true,
  imports: [
    NgIf,
    SpinnerComponent,
    FeatureDirective,
    FormsModule,
    ReactiveFormsModule,
    NgTemplateOutlet,
    PasswordVisibilityToggleDirective,
    FormErrorsComponent,
    RouterLink,
    AsyncPipe,
    TranslatePipe,
    UrlPipe,
  ],
})
export class UpdatePasswordComponent {
  @Optional() protected routingService = inject(RoutingService, {
    optional: true,
  });

  constructor(protected service: UpdatePasswordComponentService) {
    useFeatureStyles('a11yPasswordVisibilityBtnValueOverflow');
  }

  form: UntypedFormGroup = this.service.form;
  isUpdating$: Observable<boolean> = this.service.isUpdating$;

  onSubmit(): void {
    this.service.updatePassword();
  }

  navigateTo(cxRoute: string): void {
    this.routingService?.go({ cxRoute });
  }
}
