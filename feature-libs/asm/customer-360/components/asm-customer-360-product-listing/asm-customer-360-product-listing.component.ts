/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { Product } from '@spartacus/core';
import { BREAKPOINT, BreakpointService } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductItem } from './product-item.model';
import { TranslatePipe } from '@spartacus/core';
import { AsmCustomer360ProductItemComponent } from '../asm-customer-360-product-item/asm-customer-360-product-item.component';
import {
  NgIf,
  NgTemplateOutlet,
  NgClass,
  NgFor,
  AsyncPipe,
} from '@angular/common';

@Component({
  selector: 'cx-asm-customer-360-product-listing',
  templateUrl: './asm-customer-360-product-listing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgTemplateOutlet,
    NgClass,
    NgFor,
    AsmCustomer360ProductItemComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class AsmCustomer360ProductListingComponent implements OnInit {
  @Input()
  emptyResultDescription: string;

  @Input()
  headerInactive: boolean;

  @Input()
  headerText: string;

  @Input()
  products: Array<ProductItem | Product>;

  @Input()
  headerTemplate: TemplateRef<void>;

  @Output()
  clickHeader: EventEmitter<void> = new EventEmitter();

  @Output()
  selectProduct: EventEmitter<Product> = new EventEmitter();

  numberofColumns$: Observable<number>;

  showMore: boolean;

  constructor(protected breakpointService: BreakpointService) {}

  ngOnInit(): void {
    this.numberofColumns$ = this.getNumberofColumns();
  }

  toggleShowMore(): void {
    this.showMore = !this.showMore;
  }

  protected getNumberofColumns(): Observable<number> {
    return this.breakpointService.breakpoint$.pipe(
      map((breakpoint) => {
        switch (breakpoint) {
          case BREAKPOINT.xl:
            return 3;
          case BREAKPOINT.lg:
            return 2;
          default:
            return 1;
        }
      })
    );
  }
}
