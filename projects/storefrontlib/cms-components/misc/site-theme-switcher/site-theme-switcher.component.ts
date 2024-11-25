/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ICON_TYPE } from '../icon/icon.model';
import { Observable } from 'rxjs';
import { SiteThemeSwitcherComponentService } from './site-theme-switcher.component.service';
import { SiteTheme } from '@spartacus/core';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { TranslatePipe } from '../../../../core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../core/src/i18n/testing/mock-translate.pipe';

/**
 * Component for switching themes.
 */
@Component({
  selector: 'cx-site-theme-switcher',
  templateUrl: './site-theme-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    NgFor,
    IconComponent,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class SiteThemeSwitcherComponent {
  iconTypes = ICON_TYPE;

  protected themeSwitcherComponentService = inject(
    SiteThemeSwitcherComponentService
  );

  get items$(): Observable<Array<SiteTheme>> {
    return this.themeSwitcherComponentService.getItems();
  }

  get activeItem$(): Observable<string> {
    return this.themeSwitcherComponentService.getActiveItem();
  }
  set activeItem(value: string) {
    this.themeSwitcherComponentService.setActive(value);
  }
}
