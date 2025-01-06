/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, inject } from '@angular/core';
import { Command, CommandService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { UserProfileConnector } from '../connectors';
import { RegistrationVerificationTokenFacade } from 'feature-libs/user/profile/root/facade/registration-verification-token.facade';
import {
  RegistrationVerificationToken,
  RegistrationVerificationTokenCreation,
} from '../../root/model';

@Injectable()
export class RegistrationVerificationTokenService
  implements RegistrationVerificationTokenFacade
{
  protected connector = inject(UserProfileConnector);
  protected command = inject(CommandService);

  protected createRegistrationVerificationTokenCommand: Command<
    {
      registrationVerificationTokenCreation: RegistrationVerificationTokenCreation;
    },
    RegistrationVerificationToken
  > = this.command.create(({ registrationVerificationTokenCreation }) =>
    this.connector.createRegistrationVerificationToken(
      registrationVerificationTokenCreation
    )
  );

  /**
   * create verification token for registration
   */
  createRegistrationVerificationToken(
    registrationVerificationTokenCreation: RegistrationVerificationTokenCreation
  ): Observable<RegistrationVerificationToken> {
    return this.createRegistrationVerificationTokenCommand.execute({
      registrationVerificationTokenCreation,
    });
  }
}
