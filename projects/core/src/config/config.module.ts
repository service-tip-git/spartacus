/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModuleWithProviders, NgModule } from '@angular/core';
import { ConfigFactory } from './config-factory';
import { provideConfig, provideConfigFactory } from './config-providers';
import { Config } from './config-tokens';
import { ConfigurationService } from './services/configuration.service';

@NgModule({})
export class ConfigModule {
  // To make sure ConfigurationService will be instantiated, we inject it into
  // module constructor
  constructor(_configurationService: ConfigurationService) {
    // Intentional empty constructor
  }

  /**
   * Import ConfigModule and contribute config to the global configuration
   *
   * To provide default configuration in libraries provideDefaultConfig should be used instead.
   *
   * @param config Config object to merge with the global configuration
   */
  static withConfig(config: Config): ModuleWithProviders<ConfigModule> {
    return {
      ngModule: ConfigModule,
      // eslint-disable-next-line @nx/workspace/use-provide-default-config
      providers: [provideConfig(config)],
    };
  }

  /**
   * Import ConfigModule and contribute config to the global configuration using factory function
   *
   * To provide default configuration in libraries provideDefaultConfigFactory should be used instead.
   *
   * @param configFactory Factory function that will generate configuration
   * @param deps Optional dependencies to factory function
   */
  static withConfigFactory(
    configFactory: ConfigFactory,
    deps?: any[]
  ): ModuleWithProviders<ConfigModule> {
    return {
      ngModule: ConfigModule,
      // eslint-disable-next-line @nx/workspace/use-provide-default-config-factory
      providers: [provideConfigFactory(configFactory, deps)],
    };
  }

  /**
   * Module with providers, should be imported only once, if possible, at the root of the app.
   *
   * @param config
   */
  static forRoot(config: Config = {}): ModuleWithProviders<ConfigModule> {
    return {
      ngModule: ConfigModule,
      // eslint-disable-next-line @nx/workspace/use-provide-default-config
      providers: [provideConfig(config)],
    };
  }
}
