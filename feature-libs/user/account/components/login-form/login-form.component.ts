/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import {
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { useFeatureStyles } from '@spartacus/core';
import { Observable } from 'rxjs';
import { LoginFormComponentService } from './login-form-component.service';
import { TranslatePipe } from '@spartacus/core';
import { UrlPipe } from '@spartacus/core';
import { RouterLink } from '@angular/router';
import { PasswordVisibilityToggleDirective } from '@spartacus/storefront';
import { FormErrorsComponent } from '@spartacus/storefront';
import { FeatureDirective } from '@spartacus/core';
import { SpinnerComponent } from '@spartacus/storefront';
import { NgIf, NgTemplateOutlet, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-login-form',
  templateUrl: './login-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
    FeatureDirective,
    NgTemplateOutlet,
    FormErrorsComponent,
    PasswordVisibilityToggleDirective,
    RouterLink,
    AsyncPipe,
    UrlPipe,
    TranslatePipe,
    TranslatePipe,
  ],
})
export class LoginFormComponent {
  constructor(protected service: LoginFormComponentService) {
    useFeatureStyles('a11yPasswordVisibilityBtnValueOverflow');
  }

  form: UntypedFormGroup = this.service.form;
  isUpdating$: Observable<boolean> = this.service.isUpdating$;

  @HostBinding('class.user-form') style = true;

  onSubmit(): void {
    this.service.login();
  }
}
