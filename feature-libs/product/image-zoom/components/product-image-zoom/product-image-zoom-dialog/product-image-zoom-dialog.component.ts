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
  Input,
} from '@angular/core';
import { useFeatureStyles } from '@spartacus/core';
import {
  FocusConfig,
  ICON_TYPE,
  LaunchDialogService,
} from '@spartacus/storefront';
import { FocusDirective } from '../../../../../../projects/storefrontlib/layout/a11y/keyboard-focus/focus.directive';
import { IconComponent } from '../../../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { ProductImageZoomViewComponent } from '../product-image-zoom-view/product-image-zoom-view.component';
import { TranslatePipe } from '../../../../../../projects/core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';

@Component({
    selector: 'cx-product-image-zoom-dialog',
    templateUrl: 'product-image-zoom-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FocusDirective,
        IconComponent,
        ProductImageZoomViewComponent,
        TranslatePipe,
        MockTranslatePipe,
    ],
})
export class ProductImageZoomDialogComponent {
  iconType = ICON_TYPE;

  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: 'button',
    focusOnEscape: true,
  };

  @Input() galleryIndex: number;

  @HostListener('click', ['$event'])
  handleClick(event: UIEvent): void {
    // Close on click outside the dialog window
    if ((event.target as any).tagName === this.el.nativeElement.tagName) {
      this.close('Cross click');
    }
  }

  constructor(
    protected launchDialogService: LaunchDialogService,
    protected el: ElementRef
  ) {
    useFeatureStyles('a11yCloseProductImageBtnFocus');
    useFeatureStyles('a11yExpandedFocusIndicator');
  }

  close(reason = ''): void {
    this.launchDialogService.closeDialog(reason);
  }
}
