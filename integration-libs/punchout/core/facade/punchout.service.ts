import { inject, Injectable } from '@angular/core';

import {
  PunchoutFacade,
  PunchoutRequisition,
  PunchoutSession,
} from '@spartacus/punchout/root';
import { Observable } from 'rxjs';
import { PunchoutConnector } from '../connectors';

@Injectable()
export class PunchoutService implements PunchoutFacade {
  protected punchoutConnector = inject(PunchoutConnector);

  getPunchoutSession(sId: string): Observable<PunchoutSession> {
    return this.punchoutConnector.getPunchoutSession(sId);
  }

  getPunchoutRequisition(sId: string): Observable<PunchoutRequisition> {
    return this.punchoutConnector.getPunchoutRequisition(sId);
  }
}
