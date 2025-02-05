/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, Input } from '@angular/core';
import { delay, filter, switchMap, take } from 'rxjs/operators';
import { ConfiguratorCommonsService } from '../../../core/facade/configurator-commons.service';
import { ConfiguratorAttributeCompositionContext } from '../composition/configurator-attribute-composition.model';
import { ConfiguratorStorefrontUtilsService } from '../../service/configurator-storefront-utils.service';

@Component({
  selector: 'cx-configurator-show-options',
  templateUrl: './configurator-show-options.component.html',
  standalone: false,
})
export class ConfiguratorShowOptionsComponent {
  @Input() attributeComponentContext: ConfiguratorAttributeCompositionContext;

  constructor(
    protected configuratorCommonsService: ConfiguratorCommonsService,
    protected configuratorStorefrontUtilsService: ConfiguratorStorefrontUtilsService
  ) {}

  /**
   * fires a request to read the attribute domain,
   * so that all options of the attribute become visible on the UI
   */
  showOptions() {
    this.configuratorCommonsService.readAttributeDomain(
      this.attributeComponentContext.owner,
      this.attributeComponentContext.group,
      this.attributeComponentContext.attribute
    );
    this.focusFirstValue();
  }

  protected focusFirstValue(): void {
    this.configuratorCommonsService
      .isConfigurationLoading(this.attributeComponentContext.owner)
      .pipe(
        filter((isLoading) => isLoading),
        take(1),
        switchMap(() =>
          this.configuratorCommonsService
            .isConfigurationLoading(this.attributeComponentContext.owner)
            .pipe(
              filter((isLoading) => !isLoading),
              take(1),
              delay(0) //we need to consider the re-rendering of the page
            )
        )
      )
      .subscribe(() =>
        this.configuratorStorefrontUtilsService.focusFirstActiveElement(
          '#' +
            this.configuratorStorefrontUtilsService.createAttributeUiKey(
              'group-attribute',
              this.attributeComponentContext.attribute.name
            )
        )
      );
  }
}
