/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  BaseOption,
  Product,
  RoutingService,
  VariantOptionQualifier,
  VariantQualifier,
} from '@spartacus/core';

@Component({
  selector: 'cx-product-variant-color-selector',
  templateUrl: './product-variant-color-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ProductVariantColorSelectorComponent {
  constructor(private routingService: RoutingService) {}

  @Input()
  product: Product;

  @Input()
  variants: BaseOption;

  changeColor(code: string, name: string): null {
    if (code) {
      this.routingService.go({
        cxRoute: 'product',
        params: { code, name },
      });
    }
    return null;
  }
  getVariantOptionValue(qualifiers: VariantOptionQualifier[]) {
    const obj = qualifiers.find((q) => q.qualifier === VariantQualifier.COLOR);
    return obj ? obj.value : '';
  }
}
