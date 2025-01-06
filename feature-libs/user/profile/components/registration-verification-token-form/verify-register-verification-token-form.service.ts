/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, inject } from '@angular/core';
import {
  FeatureConfigService,
  GlobalMessageService,
  GlobalMessageType,
  User,
} from '@spartacus/core';
import { UserRegisterFacade } from '../../root/facade';
import { UserSignUp } from '../../root/model';
import { Observable } from 'rxjs';

const globalMsgShowTime: number = 10000;
@Injectable()
export class RegistrationVerificationTokenFormComponentService {
  constructor(
    protected globalMessageService: GlobalMessageService,
    protected userRegisterFacade: UserRegisterFacade
  ) {}

  private featureConfigService: FeatureConfigService =
    inject(FeatureConfigService);

  displayMessage(target: string) {
    this.globalMessageService.add(
      {
        key: 'verificationTokenForm.createVerificationToken',
        params: { target },
      },
      GlobalMessageType.MSG_TYPE_CONFIRMATION,
      globalMsgShowTime
    );
  }

  register(user: UserSignUp): Observable<User> {
    return this.userRegisterFacade.register(user);
  }

  postRegisterMessage(): void {
    if (this.featureConfigService.isEnabled('a11yPostRegisterSuccessMessage')) {
      this.globalMessageService.add(
        { key: 'register.postRegisterSuccessMessage' },
        GlobalMessageType.MSG_TYPE_CONFIRMATION
      );
    } else {
      this.globalMessageService.add(
        { key: 'register.postRegisterMessage' },
        GlobalMessageType.MSG_TYPE_CONFIRMATION
      );
    }
  }
}
