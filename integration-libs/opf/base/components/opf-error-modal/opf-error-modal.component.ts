/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
} from '@angular/core';
import { OpfErrorDialogOptions } from '@spartacus/opf/base/root';
import { FocusConfig, LaunchDialogService } from '@spartacus/storefront';
import { Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { OpfErrorModalService } from './opf-error-modal.service';

@Component({
  selector: 'cx-opf-error-modal',
  templateUrl: './opf-error-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpfErrorModalComponent implements OnInit {
  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: 'button',
    focusOnEscape: true,
  };

  opfErrorDialogOptions$: Observable<{ message: string; confirm: string }>;

  @HostListener('click', ['$event'])
  handleClick(event: UIEvent): void {
    if ((event.target as any).tagName === this.el.nativeElement.tagName) {
      this.dismissModal('Backdrop click');
    }
  }

  constructor(
    protected launchDialogService: LaunchDialogService,
    protected el: ElementRef,
    protected cd: ChangeDetectorRef,
    protected opfErrorModalService: OpfErrorModalService
  ) {
    // Mechanism needed to trigger the cpnt life cycle hooks.
    timer(1).subscribe({
      complete: () => {
        this.cd.markForCheck();
      },
    });
  }

  ngOnInit() {
    this.opfErrorDialogOptions$ = this.launchDialogService.data$.pipe(
      switchMap((data: OpfErrorDialogOptions) => {
        return this.opfErrorModalService.getMessageAndConfirmTranslations(data);
      })
    );
  }

  dismissModal(reason?: any): void {
    this.launchDialogService.closeDialog(reason);
  }
}
