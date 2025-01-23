/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, Input } from '@angular/core';
import { ConfiguratorCommonsService } from '../../../core/facade/configurator-commons.service';
import { ConfiguratorAttributeCompositionContext } from '../composition/configurator-attribute-composition.model';

@Component({
  selector: 'cx-configurator-show-options',
  templateUrl: './configurator-show-options.component.html',
  standalone: false,
})
export class ConfiguratorShowOptionsComponent {
  @Input() attributeComponentContext: ConfiguratorAttributeCompositionContext;

  constructor(
    protected configuratorCommonsService: ConfiguratorCommonsService
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
  }
}
