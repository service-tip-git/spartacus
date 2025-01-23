/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
} from '@angular/core';
import { Config, useFeatureStyles } from '@spartacus/core';

@Component({
  selector: 'cx-configurator-show-more',
  templateUrl: './configurator-show-more.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ConfiguratorShowMoreComponent implements AfterViewInit {
  showMore = false;
  showHiddenText = false;
  textToShow: string;
  textNormalized: string;

  protected config = inject(Config);

  @Input() text: string;
  @Input() textSize = 60;
  @Input() productName: string;
  @Input() tabIndex = -1;

  constructor(protected cdRef: ChangeDetectorRef) {
    useFeatureStyles('productConfiguratorAttributeTypesV2');
  }

  ngAfterViewInit(): void {
    this.textNormalized = this.normalize(this.text);

    if (this.textNormalized.length > this.textSize) {
      this.showMore = true;
      this.textToShow = this.textNormalized.substring(0, this.textSize);
    } else {
      this.textToShow = this.textNormalized;
    }
    this.cdRef.detectChanges();
  }

  toggleShowMore(): void {
    this.showHiddenText = !this.showHiddenText;

    this.showHiddenText
      ? (this.textToShow = this.textNormalized)
      : (this.textToShow = this.textNormalized.substring(0, this.textSize));

    this.cdRef.detectChanges();
  }

  protected normalize(text: string = ''): string {
    return text.replace(/<[^>]*>/g, '');
  }
}
