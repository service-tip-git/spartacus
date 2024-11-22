/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { TranslationChunksConfig, TranslationResources } from '@spartacus/core';
import { en } from './en/index';
import { ja } from './ja/index';
import { de } from './de/index';
import { zh } from './zh/index';

export const organizationTranslations: TranslationResources = {
  en,
  ja,
  de,
  zh,
};

// expose all translation chunk mapping for organization sub features
export const organizationTranslationChunksConfig: TranslationChunksConfig = {
  organization: [
    'orgBudget',
    'orgBudgetAssignedCostCenters',
    'orgCostCenter',
    'orgCostCenterBudgets',
    'orgCostCenterAssignedBudgets',
    'orgUnit',
    'orgUnitChildren',
    'orgUnitAssignedRoles',
    'orgUnitApprovers',
    'orgUnitAssignedApprovers',
    'orgUnitCostCenters',
    'orgUnitUsers',
    'orgUnitUserRoles',
    'orgUnitAssignedUsers',
    'orgUnitAddress',

    'orgUserGroup',
    'orgUserGroupUsers',
    'orgUserGroupAssignedUsers',
    'orgUserGroupPermissions',
    'orgUserGroupAssignedPermissions',
    'orgUser',
    'orgUserApprovers',
    'orgUserAssignedApprovers',
    'orgUserPermissions',
    'orgUserAssignedPermissions',
    'orgUserUserGroups',
    'orgUserAssignedUserGroups',
    'orgPurchaseLimit',
  ],
};
