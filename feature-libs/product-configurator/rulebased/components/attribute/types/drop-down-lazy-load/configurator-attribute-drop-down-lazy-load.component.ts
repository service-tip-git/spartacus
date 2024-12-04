import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfiguratorCommonsService } from '../../../../core/facade/configurator-commons.service';
import { ConfiguratorAttributeBaseComponent } from '../base/configurator-attribute-base.component';
import { ConfiguratorAttributeCompositionContext } from '../../composition/configurator-attribute-composition.model';

@Component({
  selector: 'cx-configurator-attribute-drop-down-lazy-load',
  templateUrl: './configurator-attribute-drop-down-lazy-load.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguratorAttributeDropDownLazyLoadComponent extends ConfiguratorAttributeBaseComponent {
  isLoaded: boolean =
    (this.attributeComponentContext.attribute.values ?? []).length > 1;

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
