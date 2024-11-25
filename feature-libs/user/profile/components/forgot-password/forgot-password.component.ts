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
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ForgotPasswordComponentService } from './forgot-password-component.service';
import { RoutingService } from '@spartacus/core';
import { NgIf, AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '../../../../../projects/storefrontlib/shared/components/spinner/spinner.component';
import { FeatureDirective } from '../../../../../projects/core/src/features-config/directives/feature.directive';
import { FormErrorsComponent } from '../../../../../projects/storefrontlib/shared/components/form/form-errors/form-errors.component';
import { RouterLink } from '@angular/router';
import { UrlPipe } from '../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';

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
