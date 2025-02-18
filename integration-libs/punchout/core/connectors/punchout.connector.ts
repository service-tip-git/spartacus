/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { PunchoutRequisition, PunchoutSession } from '@spartacus/punchout/root';
import { Observable } from 'rxjs';
import { PunchoutAdapter } from './punchout.adapter';

@Injectable({
  providedIn: 'root',
})
export class PunchoutConnector {
  constructor(protected adapter: PunchoutAdapter) {}

  public getPunchoutSession(sId: string): Observable<PunchoutSession> {
    return this.adapter.getPunchoutSession(sId);
  }

  public getPunchoutRequisition(sId: string): Observable<PunchoutRequisition> {
    return this.adapter.getPunchoutRequisition(sId);
  }
}
