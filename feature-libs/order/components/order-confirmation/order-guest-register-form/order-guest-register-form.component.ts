/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, Input, OnDestroy, inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  AuthService,
  FeatureConfigService,
  RoutingService,
  useFeatureStyles,
} from '@spartacus/core';
import { CustomFormValidators } from '@spartacus/storefront';
import { UserRegisterFacade } from '@spartacus/user/profile/root';
import { Subscription } from 'rxjs';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { FormErrorsComponent } from '../../../../../projects/storefrontlib/shared/components/form/form-errors/form-errors.component';
import { PasswordVisibilityToggleDirective } from '../../../../../projects/storefrontlib/shared/components/form/password-visibility-toggle/password-visibility-toggle.directive';
import { NgTemplateOutlet } from '@angular/common';
import { FeatureDirective } from '../../../../../projects/core/src/features-config/directives/feature.directive';

@Component({
  selector: 'cx-guest-register-form',
  templateUrl: './order-guest-register-form.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FeatureDirective,
    NgTemplateOutlet,
    PasswordVisibilityToggleDirective,
    FormErrorsComponent,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class OrderGuestRegisterFormComponent implements OnDestroy {
  // TODO: (CXSPA-7315) Remove feature toggle in the next major
  private featureConfigService = inject(FeatureConfigService);

  protected passwordValidators = this.featureConfigService?.isEnabled(
    'formErrorsDescriptiveMessages'
  )
    ? this.featureConfigService.isEnabled(
        'enableConsecutiveCharactersPasswordRequirement'
      )
      ? [
          ...CustomFormValidators.passwordValidators,
          CustomFormValidators.noConsecutiveCharacters,
        ]
      : CustomFormValidators.passwordValidators
    : [
        this.featureConfigService.isEnabled(
          'enableConsecutiveCharactersPasswordRequirement'
        )
          ? CustomFormValidators.strongPasswordValidator
          : CustomFormValidators.passwordValidator,
      ];

  @Input() guid: string;
  @Input() email: string;

  subscription: Subscription;
  guestRegisterForm: UntypedFormGroup = this.fb.group(
    {
      password: ['', [Validators.required, ...this.passwordValidators]],
      passwordconf: ['', Validators.required],
    },
    {
      validators: CustomFormValidators.passwordsMustMatch(
        'password',
        'passwordconf'
      ),
    }
  );

  constructor(
    protected userRegisterFacade: UserRegisterFacade,
    protected routingService: RoutingService,
    protected authService: AuthService,
    protected fb: UntypedFormBuilder
  ) {
    useFeatureStyles('a11yPasswordVisibilityBtnValueOverflow');
  }

  submit() {
    if (this.guestRegisterForm.valid) {
      this.userRegisterFacade.registerGuest(
        this.guid,
        this.guestRegisterForm.value.password
      );
      if (!this.subscription) {
        this.subscription = this.authService
          .isUserLoggedIn()
          .subscribe((isLoggedIn) => {
            if (isLoggedIn) {
              this.routingService.go({ cxRoute: 'home' });
            }
          });
      }
    } else {
      this.guestRegisterForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
