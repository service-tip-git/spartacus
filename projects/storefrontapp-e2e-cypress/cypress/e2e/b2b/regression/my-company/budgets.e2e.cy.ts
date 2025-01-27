/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { budgetConfig } from '../../../../helpers/b2b/my-company/config/budget.config';
import { testMyCompanyFeatureFromConfig } from '../../../../helpers/b2b/my-company/my-company.utils';

testMyCompanyFeatureFromConfig(budgetConfig, true);
