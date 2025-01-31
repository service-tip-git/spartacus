/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CdsMerchandisingStrategyAdapter } from './adapters';
import { MerchandisingCarouselCmsModule } from './cms-components';
import { MerchandisingStrategyAdapter } from './connectors';

@NgModule({
  imports: [MerchandisingCarouselCmsModule],
  providers: [
    {
      provide: MerchandisingStrategyAdapter,
      useClass: CdsMerchandisingStrategyAdapter,
    },
  ],
})
export class MerchandisingModule {}
