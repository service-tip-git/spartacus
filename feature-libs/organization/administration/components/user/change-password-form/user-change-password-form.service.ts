/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, inject } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { FeatureConfigService, User } from '@spartacus/core';
import { CustomFormValidators } from '@spartacus/storefront';
import { FormService } from '../../shared/form/form.service';

@Injectable({
  providedIn: 'root',
})
export class UserChangePasswordFormService extends FormService<any> {
  private featureConfigService = inject(FeatureConfigService);

  /**
   * @override
   * Adds the password and confirmPassword field. Also adds the customerId field,
   * so that the customerId can be used during persistent.
   */
  protected build() {
    // TODO: (CXSPA-7315) Remove feature toggle in the next major
    const passwordValidators = this.featureConfigService?.isEnabled(
      'formErrorsDescriptiveMessages'
    )
      ? [CustomFormValidators.passwordValidator]
      : CustomFormValidators.passwordValidators;
    const form = new UntypedFormGroup({});
    form.setControl('customerId', new UntypedFormControl(''));
    form.setControl(
      'password',
      new UntypedFormControl('', [Validators.required, ...passwordValidators])
    );
    form.setControl(
      'confirmPassword',
      new UntypedFormControl('', [Validators.required, ...passwordValidators])
    );
    form.setValidators(
      CustomFormValidators.passwordsMustMatch('password', 'confirmPassword')
    );
    this.form = form;
  }

  getForm(item?: User): UntypedFormGroup | null {
    // we need do cleanup, to avoid have filled form after next open of that
    this.form = null;
    return super.getForm(item);
  }
}
