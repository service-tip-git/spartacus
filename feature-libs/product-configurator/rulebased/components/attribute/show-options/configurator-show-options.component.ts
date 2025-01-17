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
})
export class ConfiguratorShowOptionsComponent {
  constructor(
    protected configuratorCommonsService: ConfiguratorCommonsService
  ) {}

  @Input() attributeComponentContext: ConfiguratorAttributeCompositionContext;

  showOptions() {
    this.configuratorCommonsService.readAttributeDomain(
      this.attributeComponentContext.owner,
      this.attributeComponentContext.group,
      this.attributeComponentContext.attribute
    );
  }
}
