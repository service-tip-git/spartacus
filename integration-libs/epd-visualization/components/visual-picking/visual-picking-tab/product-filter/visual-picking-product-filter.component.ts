/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ICON_TYPE } from '@spartacus/storefront';
import { VisualPickingProductFilterService } from './visual-picking-product-filter.service';
import { TranslatePipe } from '@spartacus/core';
import { IconComponent } from '@spartacus/storefront';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'cx-epd-visualization-product-filter',
  templateUrl: './visual-picking-product-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, IconComponent, TranslatePipe],
})
export class VisualPickingProductFilterComponent {
  constructor(
    protected visualPickingProductFilterService: VisualPickingProductFilterService
  ) {}

  /**
   * The filter input value.
   */
  @Input()
  set filter(filter: string) {
    this.visualPickingProductFilterService.filter = filter;
  }
  get filter() {
    return this.visualPickingProductFilterService.filter;
  }

  iconTypes = ICON_TYPE;
}
