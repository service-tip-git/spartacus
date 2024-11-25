/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  CmsConfig,
  DeferLoadingStrategy,
  provideDefaultConfig,
} from '@spartacus/core';
import { ProfileTagComponent } from './profile-tag.component';

@NgModule({
    imports: [CommonModule, ProfileTagComponent],
    providers: [
        provideDefaultConfig(<CmsConfig>{
            cmsComponents: {
                ProfileTagComponent: {
                    component: ProfileTagComponent,
                    deferLoading: DeferLoadingStrategy.INSTANT,
                },
            },
        }),
    ],
    exports: [ProfileTagComponent],
})
export class ProfileTagCmsModule {}
