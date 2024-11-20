/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { LaunchDialogService } from '../../../layout/launch-dialog/services/launch-dialog.service';
import { LAUNCH_CALLER } from '../../../layout/launch-dialog/config/launch-config';
import { take } from 'rxjs/operators';
import { MockTranslatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-anonymous-consent-open-dialog',
  templateUrl: './anonymous-consent-open-dialog.component.html',
  standalone: true,
  imports: [TranslatePipe, MockTranslatePipe],
})
export class AnonymousConsentOpenDialogComponent {
  @ViewChild('open') openElement: ElementRef;

  constructor(
    protected vcr: ViewContainerRef,
    protected launchDialogService: LaunchDialogService
  ) {}

  openDialog(): void {
    const dialog = this.launchDialogService.openDialog(
      LAUNCH_CALLER.ANONYMOUS_CONSENT,
      this.openElement,
      this.vcr
    );
    if (dialog) {
      dialog.pipe(take(1)).subscribe();
    }
  }
}
