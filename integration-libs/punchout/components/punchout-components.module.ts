/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CmsConfig, provideDefaultConfig } from '@spartacus/core';
import { PunchoutButtonsComponent } from './punchout-buttons/punchout-buttons.component';
import { PunchoutRequisitionComponent } from './punchout-requisition/punchout-requisition.component';
import { PunchoutSessionComponent } from './punchout-session/punchout-session.component';
import { PunchoutComponentService } from './punchout.component.service';

@NgModule({
  declarations: [
    PunchoutSessionComponent,
    PunchoutButtonsComponent,
    PunchoutRequisitionComponent,
  ],
  exports: [
    PunchoutSessionComponent,
    PunchoutButtonsComponent,
    PunchoutRequisitionComponent,
  ],
  imports: [CommonModule, FormsModule],
  providers: [
    PunchoutComponentService,
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        PunchoutSessionComponent: {
          component: PunchoutSessionComponent,
        },
        PunchoutButtonsComponent: {
          component: PunchoutButtonsComponent,
        },
        PunchoutRequisitionComponent: {
          component: PunchoutRequisitionComponent,
        },
      },
    }),
  ],
})
export class PunchoutComponentsModule {}
