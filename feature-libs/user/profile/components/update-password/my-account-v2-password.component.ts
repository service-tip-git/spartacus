/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { GlobalMessageType, useFeatureStyles } from '@spartacus/core';
import { Observable } from 'rxjs';
import { UpdatePasswordComponentService } from './update-password-component.service';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { FormErrorsComponent } from '../../../../../projects/storefrontlib/shared/components/form/form-errors/form-errors.component';
import { FeatureDirective } from '../../../../../projects/core/src/features-config/directives/feature.directive';
import { PasswordVisibilityToggleDirective } from '../../../../../projects/storefrontlib/shared/components/form/password-visibility-toggle/password-visibility-toggle.directive';
import { MessageComponent } from '../../../../../projects/storefrontlib/cms-components/misc/message/message.component';
import { SpinnerComponent } from '../../../../../projects/storefrontlib/shared/components/spinner/spinner.component';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-my-account-v2-password',
  templateUrl: './my-account-v2-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    SpinnerComponent,
    FormsModule,
    ReactiveFormsModule,
    MessageComponent,
    PasswordVisibilityToggleDirective,
    FeatureDirective,
    FormErrorsComponent,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class MyAccountV2PasswordComponent {
  protected service = inject(UpdatePasswordComponentService);
  showingAlert: boolean = true;
  globalMessageType = GlobalMessageType;
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;

  form: UntypedFormGroup = this.service.form;
  isUpdating$: Observable<boolean> = this.service.isUpdating$;

  constructor() {
    useFeatureStyles('a11yPasswordVisibilityBtnValueOverflow');
  }

  onSubmit(): void {
    this.service.updatePassword();
  }

  onCancel(): void {
    this.oldPassword = '';
    this.newPassword = '';
    this.newPasswordConfirm = '';
  }
  closeDialogConfirmationAlert() {
    this.showingAlert = false;
  }
}
