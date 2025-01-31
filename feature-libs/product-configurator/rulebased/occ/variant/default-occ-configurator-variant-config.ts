/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OccConfig } from '@spartacus/core';

export function defaultOccVariantConfiguratorConfigFactory(): OccConfig {
  return {
    backend: {
      occ: {
        endpoints: {
          createVariantConfiguration:
            'products/${productCode}/configurators/ccpconfigurator',

          readVariantConfiguration: 'ccpconfigurator/${configId}',

          updateVariantConfiguration: 'ccpconfigurator/${configId}',

          addVariantConfigurationToCart:
            'users/${userId}/carts/${cartId}/entries/ccpconfigurator',

          readVariantConfigurationForCartEntry:
            'users/${userId}/carts/${cartId}/entries/${cartEntryNumber}/ccpconfigurator',

          updateVariantConfigurationForCartEntry:
            'users/${userId}/carts/${cartId}/entries/${cartEntryNumber}/ccpconfigurator',

          readVariantConfigurationOverviewForOrderEntry:
            'users/${userId}/orders/${orderId}/entries/${orderEntryNumber}/ccpconfigurator/configurationOverview',

          readVariantConfigurationOverviewForSavedCartEntry:
            'users/${userId}/carts/${cartId}/entries/${cartEntryNumber}/ccpconfigurator/configurationOverview',

          readVariantConfigurationOverviewForQuoteEntry:
            'users/${userId}/quotes/${quoteId}/entries/${quoteEntryNumber}/ccpconfigurator/configurationOverview',

          readVariantConfigurationPriceSummary:
            'ccpconfigurator/${configId}/pricing',

          getVariantConfigurationOverview:
            'ccpconfigurator/${configId}/configurationOverview',

          searchConfiguratorVariants: 'ccpconfigurator/${configId}/variants',
        },
      },
    },
  };
}
