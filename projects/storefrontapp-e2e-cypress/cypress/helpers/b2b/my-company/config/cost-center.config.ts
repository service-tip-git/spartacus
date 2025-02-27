/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { FULL_BASE_URL_EN_USD } from '../../../site-context-selector';
import { randomString } from '../../../user';
import { INPUT_TYPE, MyCompanyConfig, MY_COMPANY_FEATURE } from '../models';

export const costCenterConfig: MyCompanyConfig = {
  name: 'Cost Center',
  baseUrl: `${FULL_BASE_URL_EN_USD}/organization/cost-centers`,
  apiEndpoint: '/costcenters',
  objectType: 'costCenters',
  verifyStatusInDetails: true,
  selectOptionsEndpoint: ['*availableOrgUnitNodes*'],
  rows: [
    {
      label: 'Code',
      sortLabel: 'Code',
      variableName: 'uid',
      inputType: INPUT_TYPE.TEXT,
      createValue: `test-entity-${randomString()}`,
      updateValue: `edited-entity-${randomString()}`,
      formLabel: 'Code',
      showInDetails: true,
      useInUrl: true,
    },
    {
      label: 'Name',
      variableName: 'name',
      inputType: INPUT_TYPE.TEXT,
      createValue: `Test Entity ${randomString()}`,
      updateValue: `Edited Test Entity ${randomString()}`,
      sortLabel: 'name',
      showInTable: true,
      formLabel: 'Name',
      showInDetails: true,
    },
    {
      label: 'Status',
      variableName: 'uid',
      inputType: INPUT_TYPE.TEXT,
      createValue: 'Active',
      updateValue: 'Active',
      showInTable: true,
      showInDetails: true,
    },
    {
      label: 'Currency',
      variableName: 'currency',
      inputType: INPUT_TYPE.NG_SELECT,
      formLabel: 'Currency',
      createValue: 'US Dollar',
      updateValue: 'US Dollar',
    },
    {
      label: 'Unit',
      variableName: 'orgUnit.name',
      link: `/organization/units/Custom%20Retail`,
      updatedLink: `/organization/units/Rustic%20Retail`,
      sortLabel: 'Unit',
      inputType: INPUT_TYPE.NG_SELECT,
      createValue: 'Custom Retail',
      updateValue: 'Rustic Retail',
      showInTable: true,
      formLabel: 'Parent Unit',
      showInDetails: true,
    },
  ],
  subCategories: [
    {
      name: 'Budgets',
      baseUrl: `/budgets`,
      apiEndpoint: '**/budgets**',
      objectType: 'budgets',
      manageAssignments: true,
    },
  ],
  features: [
    MY_COMPANY_FEATURE.CREATE,
    MY_COMPANY_FEATURE.DISABLE,
    MY_COMPANY_FEATURE.UPDATE,
    MY_COMPANY_FEATURE.LIST,
    MY_COMPANY_FEATURE.ASSIGNMENTS,
  ],
  coreFeatures: [
    MY_COMPANY_FEATURE.CREATE,
    MY_COMPANY_FEATURE.DISABLE,
    MY_COMPANY_FEATURE.UPDATE,
    MY_COMPANY_FEATURE.LIST,
  ],
};
