/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  Optional,
  inject,
} from '@angular/core';
import { Product, ProductScope, RoutingService } from '@spartacus/core';
import {
  CurrentProductService,
  ProductListItemContext,
} from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CommonConfigurator,
  ReadOnlyPostfix,
} from '../../core/model/common-configurator.model';
import { ConfiguratorProductScope } from '../../core/model/configurator-product-scope';

@Component({
  selector: 'cx-configure-product',
  templateUrl: './configure-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ConfigureProductComponent {
  nonConfigurable: Product = { configurable: false };
  product$: Observable<Product> = this.getProduct().pipe(
    //needed because also currentProductService might return null
    map((product) => (product ? product : this.nonConfigurable))
  );

  ownerTypeProduct: CommonConfigurator.OwnerType =
    CommonConfigurator.OwnerType.PRODUCT;
  @Optional() protected routingService = inject(RoutingService, {
    optional: true,
  });

  protected getProduct(): Observable<Product | null> {
    if (this.productListItemContext) {
      return this.productListItemContext.product$;
    }

    return this.currentProductService
      ? this.currentProductService.getProduct([
          ProductScope.DETAILS,
          ConfiguratorProductScope.CONFIGURATOR,
        ])
      : of(null);
  }

  /**
   * Retrieves a translation key for aria-label depending on the condition.
   *
   * @param configuratorType - configurator type
   * @returns - If the configurator type contains a read-only postfix then 'configurator.a11y.showDetailsProduct' translation key will be returned,
   * otherwise 'configurator.a11y.configureProduct'.
   */
  getAriaLabelTranslationKey(configuratorType?: string): string {
    return this.isConfiguratorTypeReadOnly(configuratorType)
      ? 'configurator.a11y.showDetailsProduct'
      : 'configurator.a11y.configureProduct';
  }

  /**
   * Retrieves a translation key depending on the condition.
   *
   * @param configuratorType - configurator type
   * @returns - If the configurator type contains a read-only postfix then 'configurator.header.toConfigReadOnly' translation key will be returned,
   * otherwise 'configurator.header.toconfig'.
   */
  getTranslationKey(configuratorType?: string): string {
    return this.isConfiguratorTypeReadOnly(configuratorType)
      ? 'configurator.header.toConfigReadOnly'
      : 'configurator.header.toconfig';
  }

  /**
   * Verifies whether restart dialog should be displayed or not.
   *
   * @param configuratorType
   * @returns - If the configurator type contains a read-only postfix then false will be returned, otherwise true.
   */
  isDisplayRestartDialog(configuratorType?: string): string {
    return this.isConfiguratorTypeReadOnly(configuratorType) ? 'false' : 'true';
  }

  /**
   * Verifies whether a configurator type of a product contains a read-only postfix and
   * a product is a base product.
   *
   * @param product - product
   * @returns - If the configurator type contains a read-only postfix and
   * a product is a base product then returns true, otherwise false.
   */
  isReadOnlyBaseProduct(product: Product): boolean {
    return (
      this.isConfiguratorTypeReadOnly(product.configuratorType) &&
      this.isBaseProduct(product)
    );
  }

  /**
   * Verifies whether a product is a base product.
   *
   * The `baseProduct` property contains the product code of the base product.
   * If the `baseProduct` is undefined or if the provided product code equals the code of the base product,
   * then this product is a base product.
   *
   * @param product - product
   * @returns - If a product is a base product then returns true, otherwise false.
   * @protected
   */
  protected isBaseProduct(product: Product): boolean {
    return !product.baseProduct || product.baseProduct === product.code;
  }

  navigateToConfigurator(product: Product): void {
    this.routingService?.go(
      {
        cxRoute: 'configure' + product.configuratorType,
        params: {
          ownerType: this.ownerTypeProduct,
          entityKey: product.code,
        },
      },
      {
        queryParams: {
          displayRestartDialog: this.isDisplayRestartDialog(
            product.configuratorType
          ),
          productCode: product.code,
        },
      }
    );
  }

  protected isConfiguratorTypeReadOnly(configuratorType?: string): boolean {
    return (
      !!configuratorType && configuratorType.trim().endsWith(ReadOnlyPostfix)
    );
  }

  constructor(
    @Optional() protected productListItemContext: ProductListItemContext, // when on PLP
    @Optional() protected currentProductService: CurrentProductService // when on PDP
  ) {}
}
