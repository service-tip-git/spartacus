/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { LoginComponent } from '../login';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { UrlPipe } from '../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { RouterLink } from '@angular/router';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-my-account-v2-user',
  templateUrl: './my-account-v2-user.component.html',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    AsyncPipe,
    UrlPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class MyAccountV2UserComponent extends LoginComponent {}
