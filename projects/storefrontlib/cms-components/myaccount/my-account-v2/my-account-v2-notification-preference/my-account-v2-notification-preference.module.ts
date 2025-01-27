/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, FeaturesConfigModule, I18nModule } from '@spartacus/core';
import { CmsPageGuard } from '../../../../cms-structure/guards/cms-page.guard';
import { PageLayoutComponent } from '../../../../cms-structure/page/page-layout/page-layout.component';
import { SpinnerModule } from '../../../../shared/components/spinner/spinner.module';
import { MyAccountV2NotificationPreferenceComponent } from './my-account-v2-notification-preference.component';

@NgModule({
  declarations: [MyAccountV2NotificationPreferenceComponent],
  imports: [
    CommonModule,
    SpinnerModule,
    I18nModule,
    RouterModule.forChild([
      {
        // @ts-ignore
        path: null,
        canActivate: [AuthGuard, CmsPageGuard],
        component: PageLayoutComponent,
        data: { cxRoute: 'notificationPreference' },
      },
    ]),
    FeaturesConfigModule,
  ],
  exports: [MyAccountV2NotificationPreferenceComponent],
})
export class MyAccountV2NotificationPreferenceModule {}
