/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { APP_INITIALIZER, Provider } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigInitializerService } from '../../config/config-initializer/config-initializer.service';
import { Config } from '../../config/config-tokens';
import { BaseSiteService } from '../facade/base-site.service';
import { CurrencyService } from '../facade/currency.service';
import { LanguageService } from '../facade/language.service';
import { SiteContextRoutesHandler } from '../services/site-context-routes-handler';

export function initializeContext(
  configInit: ConfigInitializerService,
  siteContextRoutesHandler: SiteContextRoutesHandler
): () => Promise<Config> {
  return () => {
    return lastValueFrom(
      configInit.getStable('context').pipe(
        tap(() => {
          // `siteContextRoutesHandler.init()` should be executed before CurrencyInitializer,
          // LanguageInitializer and BaseSiteInitializer
          // (now it's the case, thanks to the order of providers for APP_INITIALIZER).
          //
          // TODO(#12351): move it to the logic of specific context initializers
          siteContextRoutesHandler.init();
        })
      )
    );
  };
}

export const contextServiceProviders: Provider[] = [
  BaseSiteService,
  LanguageService,
  CurrencyService,
  {
    provide: APP_INITIALIZER,
    useFactory: initializeContext,
    deps: [ConfigInitializerService, SiteContextRoutesHandler],
    multi: true,
  },
];
