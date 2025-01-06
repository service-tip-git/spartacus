/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder } from '@angular/forms';
import { ConsentTemplate, Title } from '@spartacus/core';
import { UserRegisterFacade } from '@spartacus/user/profile/root';
import { Observable } from 'rxjs';

@Injectable()
export class OneTimePasswordLoginRegisterComponentService {
  constructor(
    protected userRegisterFacade: UserRegisterFacade,
    protected fb?: UntypedFormBuilder
  ) {}

  /**
   * Returns titles that can be used for the user profiles.
   */
  getTitles(): Observable<Title[]> {
    return this.userRegisterFacade.getTitles();
  }

  /**
   * Get if any additional consents needs to be provided during registration
   * In core feature, no additional consents are necessary during registration.
   * In integration scenarios, eg: cdc, this method will be overridden to return
   * necessary cdc consents
   */
  getAdditionalConsents(): {
    template: ConsentTemplate;
    required: boolean;
  }[] {
    return [];
  }

  /**
   * Generate form control if any additional consents that needs to be provided during registration
   * In core feature, no additional consents are necessary during registration.
   * In integration scenarios, eg: cdc, this method will be overridden to return
   * form controls for necessary cdc consents
   */
  generateAdditionalConsentsFormControl(): UntypedFormArray | undefined {
    return this.fb?.array([]) ?? undefined;
  }
}
