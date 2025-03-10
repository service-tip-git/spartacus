/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Config } from '@spartacus/core';

export interface AttributeComponentAssignment {
  [componentType: string]: any;
}

export interface ConfiguratorAttributeComposition {
  assignment?: AttributeComponentAssignment;
}

@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class ConfiguratorAttributeCompositionConfig {
  productConfigurator?: ConfiguratorAttributeComposition;
}
