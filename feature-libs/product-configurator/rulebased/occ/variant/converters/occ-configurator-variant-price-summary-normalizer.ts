/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { OccConfigurator } from '../variant-configurator-occ.models';
import { Configurator } from './../../../core/model/configurator.model';

@Injectable({ providedIn: 'root' })
export class OccConfiguratorVariantPriceSummaryNormalizer
  implements Converter<OccConfigurator.Prices, Configurator.PriceSummary>
{
  convert(
    source: OccConfigurator.Prices,
    target?: Configurator.PriceSummary
  ): Configurator.PriceSummary {
    const resultTarget: Configurator.PriceSummary = {
      ...target,
      ...source.priceSummary,
    };

    return resultTarget;
  }
}
