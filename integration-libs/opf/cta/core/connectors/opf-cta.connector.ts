/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, inject } from '@angular/core';
import { CtaScriptsRequest, CtaScriptsResponse } from '@spartacus/opf/cta/root';

import { Observable } from 'rxjs';
import { OpfCtaAdapter } from './opf-cta.adapter';

@Injectable()
export class OpfCtaConnector {
  protected adapter = inject(OpfCtaAdapter);

  public getCtaScripts(
    ctaScriptsRequest: CtaScriptsRequest
  ): Observable<CtaScriptsResponse> {
    return this.adapter.getCtaScripts(ctaScriptsRequest);
  }
}
