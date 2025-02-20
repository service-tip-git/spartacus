import { Injectable } from '@angular/core';
import { PunchoutSession, PunchoutState } from '@spartacus/punchout/root';

@Injectable()
export class PunchoutStateService {
  protected _punchoutState?: PunchoutState;

  setPunchoutState(punchoutState: PunchoutState) {
    this._punchoutState = {
      session: { ...punchoutState.session },
      sId: punchoutState.sId,
    };
  }

  getPunchoutState(): PunchoutState {
    return {
      session: {
        ...(this._punchoutState?.session as PunchoutSession),
      },
      sId: this._punchoutState?.sId,
    };
  }
}
