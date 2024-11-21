/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { useFeatureStyles } from '@spartacus/core';
import { Observable } from 'rxjs';
import { ResetPasswordComponentService } from './reset-password-component.service';
import { TranslatePipe } from '@spartacus/core';
import { FormErrorsComponent } from '@spartacus/storefront';
import { PasswordVisibilityToggleDirective } from '@spartacus/storefront';
import { FeatureDirective } from '@spartacus/core';
import { SpinnerComponent } from '@spartacus/storefront';
import { NgIf, NgTemplateOutlet, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-reset-password',
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'user-form' },
  standalone: true,
  imports: [
    NgIf,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
    FeatureDirective,
    NgTemplateOutlet,
    PasswordVisibilityToggleDirective,
    FormErrorsComponent,
    AsyncPipe,
    TranslatePipe,
    TranslatePipe,
  ],
})
export class ResetPasswordComponent {
  form: UntypedFormGroup = this.service.form;
  isUpdating$: Observable<boolean> = this.service.isUpdating$;

  token$: Observable<string> = this.service.resetToken$;

  constructor(protected service: ResetPasswordComponentService) {
    useFeatureStyles('a11yPasswordVisibilityBtnValueOverflow');
  }

  onSubmit(token: string) {
    this.service.resetPassword(token);
  }
}
