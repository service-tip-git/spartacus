/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { FULL_BASE_URL_EN_USD } from '../../../site-context-selector';
import { randomString } from '../../../user';
import { INPUT_TYPE, MyCompanyConfig, MY_COMPANY_FEATURE } from '../models';

export const budgetConfig: MyCompanyConfig = {
  name: 'Budget',
  baseUrl: `${FULL_BASE_URL_EN_USD}/organization/budgets`,
  apiEndpoint: '/users/current/budgets',
  objectType: 'budgets',
  verifyStatusInDetails: true,
  selectOptionsEndpoint: ['*availableOrgUnitNodes*'],
  rows: [
    {
      label: 'Name',
      variableName: 'name',
      inputType: INPUT_TYPE.TEXT,
      createValue: `Test Entity ${randomString()}`,
      updateValue: `Edited Test Entity ${randomString()}`,
      sortLabel: 'Name',
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
      label: 'Amount',
      variableName: 'budget',
      sortLabel: 'Value',
      showInTable: true,
      inputType: INPUT_TYPE.TEXT,
      createValue: '10000',
      updateValue: '35000',
      formLabel: 'Amount',
      showInDetails: true,
    },
    {
      label: 'Start - End',
      variableName: ['startDate', 'endDate'],
      useDatePipe: true,
      showInTable: true,
    },
    {
      label: 'Start',
      variableName: 'startDate',
      inputType: INPUT_TYPE.DATE,
      formLabel: 'Start',
      createValue: '3020-10-10',
      updateValue: '3025-01-10',
    },
    {
      label: 'End',
      variableName: 'endDate',
      inputType: INPUT_TYPE.DATE,
      formLabel: 'End',
      createValue: '3020-11-10',
      updateValue: '3026-05-15',
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
      formLabel: 'Unit',
      showInDetails: true,
    },
  ],
  subCategories: [
    {
      name: 'Cost Centers',
      baseUrl: '/cost-centers',
      objectType: 'costCenters',
      apiEndpoint: '**/constcenters**',
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
