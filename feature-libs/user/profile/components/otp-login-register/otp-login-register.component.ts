/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  AnonymousConsent,
  AnonymousConsentsConfig,
  AnonymousConsentsService,
  ClientAuthenticationTokenService,
  ConsentTemplate,
  GlobalMessageEntities,
  GlobalMessageService,
  GlobalMessageType,
  RoutingService,
  useFeatureStyles,
} from '@spartacus/core';
import { CustomFormValidators, sortTitles } from '@spartacus/storefront';
import {
  RegistrationVerificationToken,
  RegistrationVerificationTokenCreation,
  RegistrationVerificationTokenFacade,
  Title,
} from '@spartacus/user/profile/root';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  Subscription,
} from 'rxjs';

import { ONE_TIME_PASSWORD_REGISTRATION_PURPOSE } from '../user-account-constants';
import { OneTimePasswordLoginRegisterComponentService } from './otp-register-component.service';

@Component({
  selector: 'cx-otp-register-form',
  templateUrl: './otp-login-register.component.html',
})
export class OneTimePasswordLoginRegisterComponent
  implements OnInit, OnDestroy
{
  protected routingService = inject(RoutingService);
  protected registrationVerificationTokenFacade = inject(
    RegistrationVerificationTokenFacade
  );

  titles$: Observable<Title[]>;

  isLoading$ = new BehaviorSubject(false);

  private subscription = new Subscription();

  anonymousConsent$: Observable<{
    consent: AnonymousConsent | undefined;
    template: string;
  }>;

  registerForm: UntypedFormGroup = this.fb.group({
    titleCode: [null],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, CustomFormValidators.emailValidator]],
    newsletter: new UntypedFormControl({
      value: false,
      disabled: this.isConsentRequired(),
    }),
    additionalConsents:
      this.oneTimePasswordLoginRegisterComponentService.generateAdditionalConsentsFormControl?.() ??
      this.fb.array([]),
    termsandconditions: [false, Validators.requiredTrue],
    captcha: [false, Validators.requiredTrue],
  });

  additionalRegistrationConsents: {
    template: ConsentTemplate;
    required: boolean;
  }[];

  get additionalConsents(): UntypedFormArray {
    return this.registerForm?.get('additionalConsents') as UntypedFormArray;
  }

  updateAdditionalConsents(event: MouseEvent, index: number) {
    const { checked } = event.target as HTMLInputElement;
    this.registerForm.value.additionalConsents[index] = checked;
  }

  constructor(
    protected globalMessageService: GlobalMessageService,
    protected fb: UntypedFormBuilder,
    protected router: RoutingService,
    protected anonymousConsentsService: AnonymousConsentsService,
    protected anonymousConsentsConfig: AnonymousConsentsConfig,
    protected clientAuthenticationTokenService: ClientAuthenticationTokenService,
    protected oneTimePasswordLoginRegisterComponentService: OneTimePasswordLoginRegisterComponentService
  ) {
    useFeatureStyles('a11yPasswordVisibliltyBtnValueOverflow');
  }

  ngOnInit() {
    this.titles$ = this.oneTimePasswordLoginRegisterComponentService
      .getTitles()
      .pipe(
        map((titles: Title[]) => {
          return titles.sort(sortTitles);
        })
      );

    // TODO: Workaround: allow server for decide is titleCode mandatory (if yes, provide personalized message)
    this.subscription.add(
      this.globalMessageService
        .get()
        .pipe(filter((messages) => !!Object.keys(messages).length))
        .subscribe((globalMessageEntities: GlobalMessageEntities) => {
          const messages =
            globalMessageEntities &&
            globalMessageEntities[GlobalMessageType.MSG_TYPE_ERROR];

          if (
            messages &&
            messages.some(
              (message) => message.raw === 'This field is required.'
            )
          ) {
            this.globalMessageService.remove(GlobalMessageType.MSG_TYPE_ERROR);
            this.globalMessageService.add(
              { key: 'register.titleRequired' },
              GlobalMessageType.MSG_TYPE_ERROR
            );
          }
        })
    );

    const registerConsent =
      this.anonymousConsentsConfig?.anonymousConsents?.registerConsent ?? '';

    this.anonymousConsent$ = combineLatest([
      this.anonymousConsentsService.getConsent(registerConsent),
      this.anonymousConsentsService.getTemplate(registerConsent),
    ]).pipe(
      map(
        ([consent, template]: [
          AnonymousConsent | undefined,
          ConsentTemplate | undefined,
        ]) => {
          return {
            consent,
            template: template?.description ? template.description : '',
          };
        }
      )
    );

    this.additionalRegistrationConsents =
      this.oneTimePasswordLoginRegisterComponentService?.getAdditionalConsents() ||
      [];

    this.subscription.add(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.registerForm.get('newsletter')!.valueChanges.subscribe(() => {
        this.toggleAnonymousConsent();
      })
    );
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      this.SendRegistrationVerificationToken();
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  SendRegistrationVerificationToken(): void {
    this.isLoading$.next(true);
    this.clientAuthenticationTokenService.loadClientAuthenticationToken();
    const registrationVerificationTokenCreation =
      this.collectDataFromRegisterForm();
    this.registrationVerificationTokenFacade
      .createRegistrationVerificationToken(
        registrationVerificationTokenCreation
      )
      .subscribe({
        next: (result: RegistrationVerificationToken) =>
          this.goToVerificationTokenForm(
            result,
            registrationVerificationTokenCreation
          ),
        error: () => this.isLoading$.next(false),
        complete: () => this.onCreateRegistrationVerificationTokenComplete(),
      });
  }

  protected onCreateRegistrationVerificationTokenComplete(): void {
    this.isLoading$.next(false);
  }

  titleSelected(title: Title): void {
    this.registerForm['controls'].titleCode.setValue(title.code);
  }

  collectDataFromRegisterForm(): RegistrationVerificationTokenCreation {
    return {
      loginId: this.registerForm.value.email.toLowerCase(),
      purpose: ONE_TIME_PASSWORD_REGISTRATION_PURPOSE,
    };
  }

  protected goToVerificationTokenForm(
    registrationVerificationToken: RegistrationVerificationToken,
    registrationVerificationTokenCreation: RegistrationVerificationTokenCreation
  ): void {
    this.routingService.go(
      {
        cxRoute: 'verifyTokenForRegistration',
      },
      {
        state: {
          loginId: registrationVerificationTokenCreation.loginId,
          tokenId: registrationVerificationToken.tokenId,
          expiresIn: registrationVerificationToken.expiresIn,
          titleCode: this.registerForm.value.titleCode,
          firstName: this.registerForm.value.firstName,
          lastName: this.registerForm.value.lastName,
        },
      }
    );
  }

  isConsentGiven(consent: AnonymousConsent | undefined): boolean {
    return this.anonymousConsentsService.isConsentGiven(consent);
  }

  private isConsentRequired(): boolean {
    const requiredConsents =
      this.anonymousConsentsConfig?.anonymousConsents?.requiredConsents;
    const registerConsent =
      this.anonymousConsentsConfig?.anonymousConsents?.registerConsent;

    if (requiredConsents && registerConsent) {
      return requiredConsents.includes(registerConsent);
    }

    return false;
  }

  toggleAnonymousConsent(): void {
    const registerConsent =
      this.anonymousConsentsConfig?.anonymousConsents?.registerConsent;

    if (registerConsent) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (Boolean(this.registerForm.get('newsletter')!.value)) {
        this.anonymousConsentsService.giveConsent(registerConsent);
      } else {
        this.anonymousConsentsService.withdrawConsent(registerConsent);
      }
    }
  }

  /**
   * Triggered via CaptchaComponent when a user confirms captcha
   */
  captchaConfirmed() {
    this.registerForm.get('captcha')?.setValue(true);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
