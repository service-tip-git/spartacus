/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Config } from '@spartacus/core';
import { CdsEndpoints } from '../cds-models/cds-endpoints.model';
import { MerchandisingConfig } from './merchandising.config';
import { ProfileTagConfig } from './profile-tag.config';

@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class CdsConfig {
  cds?: {
    baseSite?: string[];
    tenant?: string;
    baseUrl?: string;
    consentTemplateId?: string;
    endpoints?: CdsEndpoints;
    merchandising?: MerchandisingConfig;
    profileTag?: ProfileTagConfig;
  };
}

declare module '@spartacus/core' {
  interface Config extends CdsConfig {}
}
