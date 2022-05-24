import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule, provideDefaultConfig } from '@spartacus/core';
import { KeyboardFocusModule } from '@spartacus/storefront';
import { ConfiguratorAttributeCompositionConfig } from '../../../composition/configurator-attribute-composition.config';
import { ConfiguratorAttributeInputFieldComponent } from './configurator-attribute-input-field.component';

@NgModule({
  imports: [
    KeyboardFocusModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    I18nModule,
  ],
  providers: [
    provideDefaultConfig(<ConfiguratorAttributeCompositionConfig>{
      productConfigurator: {
        attributeComponentAssignment: {
          AttributeType_string: ConfiguratorAttributeInputFieldComponent,
        },
      },
    }),
  ],
  declarations: [ConfiguratorAttributeInputFieldComponent],
  exports: [ConfiguratorAttributeInputFieldComponent],
})
export class ConfiguratorAttributeInputFieldModule {}
