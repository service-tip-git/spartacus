/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  CustomFormValidators,
  LAUNCH_CALLER,
  LaunchDialogService,
} from '@spartacus/storefront';
import { BehaviorSubject } from 'rxjs';
import { ONE_TIME_PASSWORD_REGISTRATION_PURPOSE } from '../user-account-constants';
import { RegistrationVerificationTokenFormComponentService } from './verify-register-verification-token-form.service';
import {
  AuthConfigService,
  FeatureConfigService,
  OAuthFlow,
  RoutingService,
} from '@spartacus/core';
import { RegistrationVerificationToken, UserSignUp } from '../../root/model';
import { RegistrationVerificationTokenFacade } from '../../root/facade';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'cx-registration-verification-token-form',
  templateUrl: './verify-register-verification-token-form.component.html',
})
export class RegistrationVerificationTokenFormComponent implements OnInit {
  constructor(
    protected fb: UntypedFormBuilder,
    protected router: RoutingService,
    protected authConfigService: AuthConfigService,
    protected registrationVerificationTokenFacade: RegistrationVerificationTokenFacade
  ) {}
  protected service: RegistrationVerificationTokenFormComponentService = inject(
    RegistrationVerificationTokenFormComponentService
  );

  protected launchDialogService: LaunchDialogService =
    inject(LaunchDialogService);

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

  protected cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  waitTime: number = 60;

  registerForm: UntypedFormGroup = this.fb.group(
    {
      password: ['', [Validators.required, ...this.passwordValidators]],
      passwordconf: ['', Validators.required],
      tokenCode: ['', Validators.required],
      titleCode: [''],
      firstName: [''],
      lastName: [''],
      email: [''],
      tokenId: [''],
    },
    {
      validators: CustomFormValidators.passwordsMustMatch(
        'password',
        'passwordconf'
      ),
    }
  );

  ngOnInit() {
    if (!!history.state) {
      this.tokenId = history.state['tokenId'];
      this.target = history.state['loginId'];
      this.titleCode = history.state['titleCode'];
      this.firstName = history.state['firstName'];
      this.lastName = history.state['lastName'];

      history.pushState(
        {
          tokenId: '',
          loginId: '',
          titleCode: '',
          firstName: '',
          lastName: '',
        },
        'verifyTokenForRegistration'
      );
    }

    if (!this.target || !this.tokenId || !this.firstName || !this.lastName) {
      this.router.go(['/login/register']);
    } else {
      this.startWaitTimeInterval();
      this.service.displayMessage(this.target);
    }
  }

  isLoading$ = new BehaviorSubject(false);

  @ViewChild('noReceiveCodeLink') element: ElementRef;

  @ViewChild('resendLink') resendLink: ElementRef;

  tokenId: string;

  tokenCode: string;

  target: string;

  titleCode: string;

  firstName: string;

  lastName: string;

  password: string;

  passwordconf: string;

  isResendDisabled: boolean = true;

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.registerUserWithVerificationToken();
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  registerUserWithVerificationToken(): void {
    this.isLoading$.next(true);
    this.registerForm.setValue({
      titleCode: this.titleCode,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.target,
      tokenId: this.tokenId,
      password: this.registerForm.value.password,
      tokenCode: this.registerForm.value.tokenCode,
      passwordconf: this.registerForm.value.passwordconf,
    });
    this.service
      .register(this.collectDataFromRegisterForm(this.registerForm.value))
      .subscribe({
        next: () => this.onRegisterUserSuccess(),
        complete: () => this.isLoading$.next(false),
        error: (error: HttpErrorResponse) => {
          if (error.status == 400) {
            this.registerForm
              .get('tokenCode')
              ?.setErrors({ invalidTokenCodeError: error.message });
          }
          this.isLoading$.next(false);
        },
      });
  }

  collectDataFromRegisterForm(formData: any): UserSignUp {
    const {
      firstName,
      lastName,
      email,
      password,
      titleCode,
      tokenId: verificationTokenId,
      tokenCode: verificationTokenCode,
    } = formData;

    return {
      firstName,
      lastName,
      uid: email.toLowerCase(),
      password,
      titleCode,
      verificationTokenId,
      verificationTokenCode,
    };
  }

  protected onRegisterUserSuccess(): void {
    if (
      this.authConfigService.getOAuthFlow() ===
      OAuthFlow.ResourceOwnerPasswordFlow
    ) {
      this.router.go('login');
    }
    this.service.postRegisterMessage();
  }

  resendOTP(): void {
    this.isResendDisabled = true;
    this.resendLink.nativeElement.tabIndex = -1;
    this.waitTime = 60;
    this.startWaitTimeInterval();
    this.createRegistrationVerificationToken(
      this.target,
      ONE_TIME_PASSWORD_REGISTRATION_PURPOSE
    ).subscribe({
      next: (result: RegistrationVerificationToken) =>
        (this.tokenId = result.tokenId),
      complete: () => this.service.displayMessage(this.target),
    });
  }

  createRegistrationVerificationToken(loginId: string, purpose: string) {
    return this.registrationVerificationTokenFacade.createRegistrationVerificationToken(
      {
        loginId,
        purpose,
      }
    );
  }

  startWaitTimeInterval(): void {
    const interval = setInterval(() => {
      this.waitTime--;
      this.cdr.detectChanges();
      if (this.waitTime <= 0) {
        clearInterval(interval);
        this.isResendDisabled = false;
        this.resendLink.nativeElement.tabIndex = 0;
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  openInfoDailog(): void {
    this.launchDialogService.openDialogAndSubscribe(
      LAUNCH_CALLER.ACCOUNT_VERIFICATION_TOKEN,
      this.element
    );
  }

  onOpenInfoDailogKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openInfoDailog();
    }
  }
}
