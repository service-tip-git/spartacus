/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { useFeatureStyles } from '@spartacus/core';
import { FocusConfig, ICON_TYPE } from '@spartacus/storefront';
import { ClearCartDialogComponentService } from './clear-cart-dialog-component.service';
import { FocusDirective } from '../../../../../../projects/storefrontlib/layout/a11y/keyboard-focus/focus.directive';
import { NgIf } from '@angular/common';
import { FeatureDirective } from '../../../../../../projects/core/src/features-config/directives/feature.directive';
import { IconComponent } from '../../../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { SpinnerComponent } from '../../../../../../projects/storefrontlib/shared/components/spinner/spinner.component';
import { TranslatePipe } from '../../../../../../projects/core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';

@Component({
  selector: 'cx-clear-cart-dialog',
  templateUrl: './clear-cart-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FocusDirective,
    NgIf,
    FeatureDirective,
    IconComponent,
    SpinnerComponent,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class ClearCartDialogComponent implements OnDestroy {
  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: 'button.btn-primary',
    focusOnEscape: true,
  };

  isClearing: boolean = false;

  iconTypes = ICON_TYPE;

  @HostListener('click', ['$event'])
  handleClick(event: UIEvent): void {
    // Close on click outside the dialog window
    if ((event.target as any).tagName === this.el.nativeElement.tagName) {
      this.close('Cross click');
    }
  }

  constructor(
    protected el: ElementRef,
    protected clearCartDialogComponentService: ClearCartDialogComponentService
  ) {
    useFeatureStyles('a11yExpandedFocusIndicator');
  }

  clearCart(): void {
    this.isClearing = true;
    this.clearCartDialogComponentService.deleteActiveCart();
  }

  close(reason: string): void {
    this.clearCartDialogComponentService.closeDialog(reason);
  }

  ngOnDestroy(): void {
    this.close('close dialog on component destroy');
  }
}
