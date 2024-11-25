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
  inject,
} from '@angular/core';
import { ProductListOutlets } from '../../product-outlets.model';
import { ProductListItemContextSource } from '../model/product-list-item-context-source.model';
import { ProductListItemContext } from '../model/product-list-item-context.model';
import { ProductListService } from '../product-list.service';
import { RouterLink } from '@angular/router';
import { MediaComponent } from '../../../../shared/components/media/media.component';
import { OutletDirective } from '../../../../cms-structure/outlet/outlet.directive';
import { NgIf } from '@angular/common';
import { StarRatingComponent } from '../../../../shared/components/star-rating/star-rating.component';
import { InnerComponentsHostDirective } from '../../../../cms-structure/page/component/inner-components-host.directive';
import { TranslatePipe } from '../../../../../core/src/i18n/translate.pipe';
import { UrlPipe } from '../../../../../core/src/routing/configurable-routes/url-translation/url.pipe';
import { MockTranslatePipe } from '../../../../../core/src/i18n/testing/mock-translate.pipe';

@Component({
    selector: 'cx-product-grid-item',
    templateUrl: './product-grid-item.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        ProductListItemContextSource,
        {
            provide: ProductListItemContext,
            useExisting: ProductListItemContextSource,
        },
    ],
    imports: [
        RouterLink,
        MediaComponent,
        OutletDirective,
        NgIf,
        StarRatingComponent,
        InnerComponentsHostDirective,
        TranslatePipe,
        UrlPipe,
        MockTranslatePipe,
    ],
})
export class ProductGridItemComponent implements OnChanges {
  protected productListService = inject(ProductListService);
  hideAddToCartButton = false;

  readonly ProductListOutlets = ProductListOutlets;
  @Input() product: any;

  constructor(
    protected productListItemContextSource: ProductListItemContextSource
  ) {}

  ngOnChanges(changes?: SimpleChanges): void {
    if (changes?.product) {
      this.hideAddToCartButton =
        this.productListService.shouldHideAddToCartButton(this.product);
      this.productListItemContextSource.product$.next(this.product);
    }
  }
}
