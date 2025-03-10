/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  BaseOption,
  isNotUndefined,
  OccConfig,
  Product,
  ProductScope,
  ProductService,
  RoutingService,
  VariantOptionQualifier,
  VariantQualifier,
} from '@spartacus/core';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'cx-product-variant-style-selector',
  templateUrl: './product-variant-style-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ProductVariantStyleSelectorComponent {
  constructor(
    private config: OccConfig,
    private productService: ProductService,
    private routingService: RoutingService
  ) {}

  variantQualifier = VariantQualifier;

  @Input()
  variants: BaseOption;

  getVariantOptionValue(qualifiers: VariantOptionQualifier[]) {
    const obj = qualifiers.find((q) => q.qualifier === VariantQualifier.STYLE);
    return obj ? obj.value : '';
  }

  getVariantThumbnailUrl(
    variantOptionQualifiers: VariantOptionQualifier[]
  ): string {
    const qualifier = variantOptionQualifiers.find((item) => item.image);

    return qualifier
      ? `${this.config?.backend?.occ?.baseUrl}${qualifier.image?.url}`
      : '';
  }

  changeStyle(code: string): null {
    if (code) {
      this.productService
        .get(code, ProductScope.LIST)
        .pipe(
          // below call might looks redundant but in fact this data is going to be loaded anyways
          // we're just calling it earlier and storing
          filter(isNotUndefined),
          take(1)
        )
        .subscribe((product: Product) => {
          this.routingService.go({
            cxRoute: 'product',
            params: product,
          });
        });
    }
    return null;
  }
}
