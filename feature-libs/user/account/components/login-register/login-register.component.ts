/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnInit, Optional, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoutingService } from '@spartacus/core';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { UrlPipe } from '../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { NgClass, NgIf } from '@angular/common';
import { FeatureDirective } from '../../../../../projects/core/src/features-config/directives/feature.directive';

@Component({
  selector: 'cx-login-register',
  templateUrl: './login-register.component.html',
  standalone: true,
  imports: [
    FeatureDirective,
    NgClass,
    NgIf,
    RouterLink,
    UrlPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class LoginRegisterComponent implements OnInit {
  loginAsGuest = false;

  @Optional() protected routingService = inject(RoutingService, {
    optional: true,
  });

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.loginAsGuest = this.activatedRoute.snapshot.queryParams['forced'];
  }

  navigateTo(cxRoute: string): void {
    this.routingService?.go({ cxRoute });
  }
}
