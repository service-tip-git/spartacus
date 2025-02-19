import { Injectable } from '@angular/core';
import { PunchoutRequisition, PunchoutSession } from '@spartacus/punchout/root';
import { Observable } from 'rxjs';
import { PunchoutAdapter } from './punchout.adapter';

@Injectable()
export class PunchoutConnector {
  constructor(protected adapter: PunchoutAdapter) {}

  public getPunchoutSession(sId: string): Observable<PunchoutSession> {
    return this.adapter.getPunchoutSession(sId);
  }

  public getPunchoutRequisition(sId: string): Observable<PunchoutRequisition> {
    return this.adapter.getPunchoutRequisition(sId);
  }
}
