/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfiguratorCommonsService } from '../../../../core/facade/configurator-commons.service';
import { ConfiguratorAttributeBaseComponent } from '../base/configurator-attribute-base.component';
import { ConfiguratorAttributeCompositionContext } from '../../composition/configurator-attribute-composition.model';
import { Configurator } from '../../../../core/model/configurator.model';

@Component({
  selector: 'cx-configurator-attribute-drop-down-lazy-load',
  templateUrl: './configurator-attribute-drop-down-lazy-load.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguratorAttributeDropDownLazyLoadComponent extends ConfiguratorAttributeBaseComponent {
  values: Configurator.Value[] =
    this.attributeComponentContext.attribute.values ?? [];
  isLoaded: boolean =
    this.values.length > 1 ||
    (this.values.length === 1 && !this.values[0].selected);

  constructor(
    protected configuratorCommonsService: ConfiguratorCommonsService,
    protected attributeComponentContext: ConfiguratorAttributeCompositionContext
  ) {
    super();
  }

  loadDomain(): void {
    this.configuratorCommonsService.readAttributeDomain(
      this.attributeComponentContext.owner,
      this.attributeComponentContext.group,
      this.attributeComponentContext.attribute
    );
  }
}
