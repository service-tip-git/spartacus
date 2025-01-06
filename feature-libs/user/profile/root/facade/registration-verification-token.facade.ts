/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { facadeFactory } from '@spartacus/core';
import { Observable } from 'rxjs';
import { USER_ACCOUNT_CORE_FEATURE } from '../../../account/root/feature-name';
import {
  RegistrationVerificationToken,
  RegistrationVerificationTokenCreation,
} from '../model';

@Injectable({
  providedIn: 'root',
  useFactory: () =>
    facadeFactory({
      facade: RegistrationVerificationTokenFacade,
      feature: USER_ACCOUNT_CORE_FEATURE,
      methods: ['createRegistrationVerificationToken'],
    }),
})
export abstract class RegistrationVerificationTokenFacade {
  abstract createRegistrationVerificationToken(
    registrationVerificationTokenCreation: RegistrationVerificationTokenCreation
  ): Observable<RegistrationVerificationToken>;
}
