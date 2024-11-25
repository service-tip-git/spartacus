/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnInit, Optional, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoutingService } from '@spartacus/core';
import { FeatureDirective } from '@spartacus/core';
import { NgClass, NgIf } from '@angular/common';
import { UrlPipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-login-register',
  templateUrl: './login-register.component.html',
  imports: [
    FeatureDirective,
    NgClass,
    NgIf,
    RouterLink,
    UrlPipe,
    TranslatePipe,
    TranslatePipe,
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
