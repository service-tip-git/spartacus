/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  Optional,
  inject,
} from '@angular/core';
import {
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { ForgotPasswordComponentService } from './forgot-password-component.service';
import { RoutingService } from '@spartacus/core';
import { NgIf, AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '@spartacus/storefront';
import { FeatureDirective } from '@spartacus/core';
import { FormErrorsComponent } from '@spartacus/storefront';
import { RouterLink } from '@angular/router';
import { UrlPipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { MockTranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-forgot-password',
  templateUrl: './forgot-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    SpinnerComponent,
    FeatureDirective,
    FormsModule,
    ReactiveFormsModule,
    FormErrorsComponent,
    RouterLink,
    AsyncPipe,
    UrlPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class ForgotPasswordComponent {
  @Optional() protected routingService = inject(RoutingService, {
    optional: true,
  });

  constructor(protected service: ForgotPasswordComponentService) {}

  form: UntypedFormGroup = this.service.form;
  isUpdating$: Observable<boolean> = this.service.isUpdating$;

  onSubmit(): void {
    this.service.requestEmail();
  }

  navigateTo(cxRoute: string): void {
    this.routingService?.go({ cxRoute });
  }
}
