/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { useFeatureStyles } from '@spartacus/core';
import { Observable } from 'rxjs';
import { LoginFormComponentService } from './login-form-component.service';
import { NgIf, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '../../../../../projects/storefrontlib/shared/components/spinner/spinner.component';
import { FeatureDirective } from '../../../../../projects/core/src/features-config/directives/feature.directive';
import { FormErrorsComponent } from '../../../../../projects/storefrontlib/shared/components/form/form-errors/form-errors.component';
import { PasswordVisibilityToggleDirective } from '../../../../../projects/storefrontlib/shared/components/form/password-visibility-toggle/password-visibility-toggle.directive';
import { RouterLink } from '@angular/router';
import { UrlPipe } from '../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';

@Component({
    selector: 'cx-login-form',
    templateUrl: './login-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
        MockTranslatePipe,
    ],
})
export class LoginFormComponent {
  constructor(protected service: LoginFormComponentService) {
    useFeatureStyles('a11yPasswordVisibliltyBtnValueOverflow');
  }

  form: UntypedFormGroup = this.service.form;
  isUpdating$: Observable<boolean> = this.service.isUpdating$;

  @HostBinding('class.user-form') style = true;

  onSubmit(): void {
    this.service.login();
  }
}
