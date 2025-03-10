/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CmsConfig, provideDefaultConfigFactory } from '@spartacus/core';
import { ORGANIZATION_USER_REGISTRATION_FEATURE } from './feature-name';

export function defaultOrganizationUserRegistrationComponentsConfig(): CmsConfig {
  const config: CmsConfig = {
    featureModules: {
      [ORGANIZATION_USER_REGISTRATION_FEATURE]: {
        cmsComponents: [
          'OrganizationUserRegistrationComponent',
          'RegisterB2BCustomerWithOTPComponent',
          'VerifyOTPForB2BRegistrationComponent',
        ],
      },
    },
  };

  return config;
}

@NgModule({
  providers: [
    provideDefaultConfigFactory(
      defaultOrganizationUserRegistrationComponentsConfig
    ),
  ],
})
export class OrganizationUserRegistrationRootModule {}
