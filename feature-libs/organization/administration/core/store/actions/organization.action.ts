/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Action } from '@ngrx/store';

export const CLEAR_ORGANIZATION_DATA = '[Organization] Clear Data';

export class OrganizationClearData implements Action {
  readonly type = CLEAR_ORGANIZATION_DATA;
}

export type OrganizationAction = OrganizationClearData;
