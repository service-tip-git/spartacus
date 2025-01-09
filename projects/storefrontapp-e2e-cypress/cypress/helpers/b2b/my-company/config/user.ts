/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { FULL_BASE_URL_EN_USD } from '../../../site-context-selector';
import { randomString } from '../../../user';
import {
  ENTITY_UID_COOKIE_KEY,
  INPUT_TYPE,
  MyCompanyConfig,
  MY_COMPANY_FEATURE,
} from '../models';

export const userConfig: MyCompanyConfig = {
  name: 'User',
  baseUrl: `${FULL_BASE_URL_EN_USD}/organization/users`,
  apiEndpoint: '/orgCustomers',
  objectType: 'users',
  entityIdField: 'customerId',
  preserveCookies: true,
  selectOptionsEndpoint: ['*availableOrgUnitNodes*', '*titles*'],
  rows: [
    {
      label: 'Name',
      variableName: 'name',
      inputType: INPUT_TYPE.TEXT,
      createValue: `Test Entity ${randomString()}`,
      updateValue: `Edited Test Entity ${randomString()}`,
      sortLabel: 'Name',
      showInTable: true,
      showInDetails: false,
      useCookie: ENTITY_UID_COOKIE_KEY,
    },
    {
      label: 'Title',
      variableName: 'titleCode',
      formLabel: 'Title',
      inputType: INPUT_TYPE.NG_SELECT,
      createValue: 'Mr.',
      updateValue: 'Mrs.',
      showInTable: false,
    },
    {
      label: 'First name',
      variableName: 'firstName',
      formLabel: 'First name',
      inputType: INPUT_TYPE.TEXT,
      createValue: `Test Entity Name ${randomString()}`,
      updateValue: `Edited Entity Name ${randomString()}`,
      showInDetails: false,
      showInTable: false,
      useInHeader: true,
    },
    {
      label: 'Last name',
      variableName: 'lastName',
      formLabel: 'Last name',
      inputType: INPUT_TYPE.TEXT,
      createValue: `Test Entity Last Name ${randomString()}`,
      updateValue: `Edited Entity Last Name ${randomString()}`,
      showInDetails: false,
      showInTable: false,
      useInHeader: true,
    },
    {
      label: 'Status',
      variableName: 'nic',
      inputType: INPUT_TYPE.TEXT,
      createValue: 'Active',
      updateValue: 'Active',
      showInTable: true,
      showInDetails: false,
    },
    {
      label: 'Email',
      variableName: 'email',
      inputType: INPUT_TYPE.TEXT,
      createValue: `${randomString()}@testing.com`,
      updateValue: `edited-${randomString()}@testing.com`,
      showInTable: true,
      showInDetails: true,
      formLabel: 'Email',
    },
    {
      label: 'Roles',
      variableName: 'roles',
      inputType: INPUT_TYPE.CHECKBOX,
      createValue: 'Customer',
      updateValue: 'Manager',
      showInTable: true,
      showInDetails: true,
    },
    {
      label: 'Roles',
      variableName: 'roles',
      formLabel: 'Roles',
      inputType: INPUT_TYPE.CHECKBOX,
      createValue: 'b2bcustomergroup',
      updateValue: 'b2bmanagergroup',
      showInTable: false,
      showInDetails: false,
    },
    {
      label: 'Rights',
      variableName: 'roles',
      inputType: INPUT_TYPE.CHECKBOX,
      createValue: 'View Unit-Level Orders',
      updateValue: 'View Unit-Level Orders',
      showInTable: false,
      showInDetails: true,
    },
    {
      label: 'Rights',
      variableName: 'rights',
      formLabel: 'Rights',
      inputType: INPUT_TYPE.CHECKBOX,
      createValue: 'unitorderviewergroup',
      updateValue: 'unitorderviewergroup',
      showInTable: false,
      showInDetails: false,
    },
    {
      label: 'Unit',
      variableName: 'orgUnit.name',
      link: `/organization/units/Rustic%20Retail`,
      updatedLink: `/organization/units/Custom%20Retail`,
      sortLabel: 'Unit',
      inputType: INPUT_TYPE.NG_SELECT,
      createValue: 'Rustic Retail',
      updateValue: 'Custom Retail',
      showInTable: true,
      showInDetails: true,
      formLabel: 'Unit',
      selector: 'cx-org-card label ng-select:contains(Unit)',
    },
  ],
  subCategories: [
    {
      name: 'Approvers',
      baseUrl: `/approvers`,
      apiEndpoint: '**/orgCustomers**',
      entityIdField: 'customerId',
      objectType: 'users',
      manageAssignments: true,
      skipAssignmentWaits: true,
    },
    {
      name: 'User groups',
      baseUrl: `/user-groups`,
      apiEndpoint: '**/orgUserGroups**',
      entityIdField: 'uid',
      objectType: 'orgUnitUserGroups',
      manageAssignments: true,
    },
    {
      name: 'Purchase limits',
      baseUrl: `/purchase-limits`,
      apiEndpoint: '**/availableOrderApprovalPermissions**',
      entityIdField: 'code',
      objectType: 'orderApprovalPermissions',
      manageAssignments: true,
    },
  ],
  features: [
    MY_COMPANY_FEATURE.CREATE,
    MY_COMPANY_FEATURE.DISABLE,
    MY_COMPANY_FEATURE.UPDATE,
    MY_COMPANY_FEATURE.LIST,
    MY_COMPANY_FEATURE.ASSIGNMENTS,
    MY_COMPANY_FEATURE.USER_PASSWORD,
  ],
  coreFeatures: [
    MY_COMPANY_FEATURE.CREATE,
    MY_COMPANY_FEATURE.DISABLE,
    MY_COMPANY_FEATURE.UPDATE,
    MY_COMPANY_FEATURE.LIST,
  ],
};
