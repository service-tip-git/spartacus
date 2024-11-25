/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { useFeatureStyles } from '@spartacus/core';
import { Observable } from 'rxjs';
import { ResetPasswordComponentService } from './reset-password-component.service';
import { NgIf, AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '../../../../../projects/storefrontlib/shared/components/spinner/spinner.component';
import { PasswordVisibilityToggleDirective } from '../../../../../projects/storefrontlib/shared/components/form/password-visibility-toggle/password-visibility-toggle.directive';
import { FeatureDirective } from '../../../../../projects/core/src/features-config/directives/feature.directive';
import { FormErrorsComponent } from '../../../../../projects/storefrontlib/shared/components/form/form-errors/form-errors.component';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';

@Component({
    selector: 'cx-reset-password',
    templateUrl: './reset-password.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'user-form' },
    imports: [
        NgIf,
        SpinnerComponent,
        FormsModule,
        ReactiveFormsModule,
        PasswordVisibilityToggleDirective,
        FeatureDirective,
        FormErrorsComponent,
        AsyncPipe,
        TranslatePipe,
        MockTranslatePipe,
    ],
})
export class ResetPasswordComponent {
  form: UntypedFormGroup = this.service.form;
  isUpdating$: Observable<boolean> = this.service.isUpdating$;

  token$: Observable<string> = this.service.resetToken$;

  constructor(protected service: ResetPasswordComponentService) {
    useFeatureStyles('a11yPasswordVisibliltyBtnValueOverflow');
  }

  onSubmit(token: string) {
    this.service.resetPassword(token);
  }
}
