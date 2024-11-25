/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Optional,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { take } from 'rxjs/operators';
import { LaunchDialogService, LAUNCH_CALLER } from '@spartacus/storefront';
import { RoutingService } from '@spartacus/core';
import { FeatureDirective } from '../../../../../../../projects/core/src/features-config/directives/feature.directive';
import { RouterLink } from '@angular/router';
import { UrlPipe } from '../../../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { TranslatePipe } from '../../../../../../../projects/core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';

@Component({
    selector: 'cx-close-account',
    templateUrl: './close-account.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FeatureDirective,
        RouterLink,
        UrlPipe,
        TranslatePipe,
        MockTranslatePipe,
    ],
})
export class CloseAccountComponent {
  @ViewChild('element') element: ElementRef;
  @Optional() protected routingService = inject(RoutingService, {
    optional: true,
  });

  constructor(
    protected launchDialogService: LaunchDialogService,
    protected vcr: ViewContainerRef
  ) {}

  openModal(): void {
    const dialog = this.launchDialogService.openDialog(
      LAUNCH_CALLER.CLOSE_ACCOUNT,
      this.element,
      this.vcr
    );

    dialog?.pipe(take(1)).subscribe();
  }

  navigateTo(cxRoute: string): void {
    this.routingService?.go({ cxRoute });
  }
}
