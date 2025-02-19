/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { CmsConfig, provideDefaultConfig } from '@spartacus/core';
import { PunchoutSessionComponent } from './punchout-session/punchout-session.component';
import { PunchoutComponentService } from './punchout.component.service';

@NgModule({
  declarations: [PunchoutSessionComponent],
  exports: [PunchoutSessionComponent],
  providers: [
    PunchoutComponentService,
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        PunchoutSessionComponent: {
          component: PunchoutSessionComponent,
        },
      },
    }),
  ],
})
export class PunchoutComponentsModule {}
