/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, inject } from '@angular/core';
import { OpfActiveConfiguration } from '@spartacus/opf/base/root';
import { Observable } from 'rxjs';
import { OpfBaseAdapter } from './opf-base.adapter';

@Injectable()
export class OpfBaseConnector {
  protected adapter = inject(OpfBaseAdapter);

  public getActiveConfigurations(): Observable<OpfActiveConfiguration[]> {
    return this.adapter.getActiveConfigurations();
  }
}
