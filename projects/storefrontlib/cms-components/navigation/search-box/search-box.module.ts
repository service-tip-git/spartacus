/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  CmsConfig,
  FeaturesConfigModule,
  I18nModule,
  UrlModule,
  provideDefaultConfig,
} from '@spartacus/core';
import { OutletModule } from '../../../cms-structure';
import { KeyboardFocusModule } from '../../../layout/a11y/keyboard-focus/keyboard-focus.module';
import { CarouselModule } from '../../../shared';
import { MediaModule } from '../../../shared/components/media/media.module';
import { IconModule } from '../../misc/icon/icon.module';
import { HighlightPipe } from './highlight.pipe';
import { SearchBoxComponent } from './search-box.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MediaModule,
    IconModule,
    UrlModule,
    I18nModule,
    OutletModule,
    FeaturesConfigModule,
    CarouselModule,
    KeyboardFocusModule,
  ],
  providers: [
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        SearchBoxComponent: {
          component: SearchBoxComponent,
        },
      },
    }),
  ],
  declarations: [SearchBoxComponent, HighlightPipe],
  exports: [SearchBoxComponent, HighlightPipe],
})
export class SearchBoxModule {}
