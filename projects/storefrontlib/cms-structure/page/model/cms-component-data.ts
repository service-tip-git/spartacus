/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Observable } from 'rxjs';
import { CmsComponent } from '@spartacus/core';

export abstract class CmsComponentData<T extends CmsComponent> {
  uid: string;
  data$: Observable<T>;
}
