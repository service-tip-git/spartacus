/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { PunchoutState } from '@spartacus/punchout/root';

@Injectable()
export class PunchoutStateService {
  protected _punchoutState?: PunchoutState;

  setPunchoutState(punchoutState: PunchoutState) {
    this._punchoutState = {
      session: { ...punchoutState.session },
      sId: punchoutState.sId,
    };
  }

  getPunchoutState() {
    return {
      ...this._punchoutState,
    };
  }
}
