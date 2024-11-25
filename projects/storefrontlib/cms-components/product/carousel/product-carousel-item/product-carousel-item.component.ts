/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Product } from '@spartacus/core';
import {
  ProductListItemContext,
  ProductListItemContextSource,
} from '../../product-list';
import { RouterLink } from '@angular/router';
import { MediaComponent } from '../../../../shared/components/media/media.component';
import { InnerComponentsHostDirective } from '../../../../cms-structure/page/component/inner-components-host.directive';
import { UrlPipe } from '../../../../../core/src/routing/configurable-routes/url-translation/url.pipe';

@Component({
  selector: 'cx-product-carousel-item',
  templateUrl: './product-carousel-item.component.html',
  providers: [
    ProductListItemContextSource,
    {
      provide: ProductListItemContext,
      useExisting: ProductListItemContextSource,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MediaComponent, InnerComponentsHostDirective, UrlPipe],
})
export class ProductCarouselItemComponent implements OnChanges {
  @Input() item: Product;

  constructor(
    protected productListItemContextSource: ProductListItemContextSource
  ) {}

  ngOnChanges(changes?: SimpleChanges): void {
    if (changes?.item) {
      this.productListItemContextSource.product$.next(this.item);
    }
  }
}
