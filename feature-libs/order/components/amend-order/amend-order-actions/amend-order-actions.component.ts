/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { RoutingService } from '@spartacus/core';
import { UntypedFormGroup } from '@angular/forms';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { UrlPipe } from '../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'cx-amend-order-actions',
  templateUrl: './amend-order-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, NgIf, UrlPipe, TranslatePipe, MockTranslatePipe],
})
export class AmendOrderActionsComponent {
  @Input() orderCode: string;
  @Input() amendOrderForm: UntypedFormGroup;
  @Input() backRoute: string;
  @Input() forwardRoute: string;

  @HostBinding('class') styles = 'row';

  constructor(protected routingService: RoutingService) {}

  continue(event: Event): void {
    if (this.amendOrderForm.valid) {
      this.routingService.go({
        cxRoute: this.forwardRoute,
        params: { code: this.orderCode },
      });
    } else {
      this.amendOrderForm.markAllAsTouched();
      event.stopPropagation();
    }
  }
}
