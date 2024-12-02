import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cx-configurator-attribute-drop-down-lazy-load',
  templateUrl: './configurator-attribute-drop-down-lazy-load.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguratorAttributeDropDownLazyLoadComponent {
  isLoaded: boolean = false;

  loadDomain(): void {
    this.isLoaded = true;
  }
}
