/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { inject, Injectable } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  AuthRedirectService,
  AuthService,
  FeatureConfigService,
  GlobalMessageService,
  GlobalMessageType,
  HttpErrorModel,
  RoutingService,
} from '@spartacus/core';
import { CustomFormValidators } from '@spartacus/storefront';
import { UserPasswordFacade } from '@spartacus/user/profile/root';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { USE_MY_ACCOUNT_V2_PASSWORD } from './use-my-account-v2-password';

@Injectable()
export class UpdatePasswordComponentService {
  // TODO: (CXSPA-7315) Remove feature toggle in the next major
  // TODO: (CXSPA-8550) Remove feature toggle
  private featureConfigService = inject(FeatureConfigService);

  protected passwordValidators = this.featureConfigService?.isEnabled(
    'formErrorsDescriptiveMessages'
  )
    ? this.featureConfigService.isEnabled('enableSecurePasswordValidation')
      ? CustomFormValidators.securePasswordValidators
      : this.featureConfigService.isEnabled(
            'enableConsecutiveCharactersPasswordRequirement'
          )
        ? [
            ...CustomFormValidators.passwordValidators,
            CustomFormValidators.noConsecutiveCharacters,
          ]
        : CustomFormValidators.passwordValidators
    : [
        this.featureConfigService.isEnabled('enableSecurePasswordValidation')
          ? CustomFormValidators.securePasswordValidator
          : this.featureConfigService.isEnabled(
                'enableConsecutiveCharactersPasswordRequirement'
              )
            ? CustomFormValidators.strongPasswordValidator
            : CustomFormValidators.passwordValidator,
      ];

  constructor(
    protected userPasswordService: UserPasswordFacade,
    protected routingService: RoutingService,
    protected globalMessageService: GlobalMessageService,
    protected authRedirectService?: AuthRedirectService,
    protected authService?: AuthService
  ) {}

  protected busy$ = new BehaviorSubject(false);

  private usingV2 = inject(USE_MY_ACCOUNT_V2_PASSWORD);

  isUpdating$ = this.busy$.pipe(
    tap((state) => (state === true ? this.form.disable() : this.form.enable()))
  );

  form: UntypedFormGroup = new UntypedFormGroup(
    {
      oldPassword: new UntypedFormControl('', Validators.required),
      newPassword: new UntypedFormControl('', [
        Validators.required,
        ...this.passwordValidators,
      ]),
      newPasswordConfirm: new UntypedFormControl('', Validators.required),
    },
    {
      validators: this.getPasswordValidators(),
    }
  );

  /**
   * Updates the password for the user.
   */
  updatePassword(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.busy$.next(true);

    const oldPassword = this.form.get('oldPassword')?.value;
    const newPassword = this.form.get('newPassword')?.value;

    this.userPasswordService.update(oldPassword, newPassword).subscribe({
      next: () => this.onSuccess(),
      error: (error: HttpErrorModel | Error) => this.onError(error),
    });
  }

  protected onSuccess(): void {
    this.globalMessageService.add(
      {
        key: this.usingV2
          ? 'myAccountV2PasswordForm.passwordUpdateSuccess'
          : 'updatePasswordForm.passwordUpdateSuccess',
      },
      GlobalMessageType.MSG_TYPE_CONFIRMATION
    );
    this.busy$.next(false);
    this.form.reset();

    // sets the redirect url after login
    this.authRedirectService?.setRedirectUrl(
      this.routingService.getUrl({ cxRoute: 'home' })
    );
    // TODO(#9638): Use logout route when it will support passing redirect url
    this.authService?.coreLogout().then(() => {
      this.routingService.go({ cxRoute: 'login' });
    });
  }

  protected onError(_error: HttpErrorModel | Error): void {
    if (
      _error instanceof HttpErrorModel &&
      _error.details?.[0].type === 'AccessDeniedError'
    ) {
      this.globalMessageService.add(
        {
          key: this.usingV2
            ? 'myAccountV2PasswordForm.accessDeniedError'
            : 'updatePasswordForm.accessDeniedError',
        },
        GlobalMessageType.MSG_TYPE_ERROR
      );
    }
    this.busy$.next(false);
    this.form.reset();
  }

  // TODO: (CXSPA-8550) Remove after removing enablePasswordsCannotMatchInPasswordUpdateForm feature toggle
  protected getPasswordValidators(): ValidatorFn[] {
    const passwordMustMatchValidator = CustomFormValidators.passwordsMustMatch(
      'newPassword',
      'newPasswordConfirm'
    );

    return this.featureConfigService.isEnabled(
      'enablePasswordsCannotMatchInPasswordUpdateForm'
    )
      ? [
          passwordMustMatchValidator,
          CustomFormValidators.passwordsCannotMatch(
            'oldPassword',
            'newPassword'
          ),
        ]
      : [passwordMustMatchValidator];
  }
}
