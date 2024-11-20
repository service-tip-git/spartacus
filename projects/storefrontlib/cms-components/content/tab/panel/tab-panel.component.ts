/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, Input } from '@angular/core';
import { Tab, TAB_MODE } from '../tab.model';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { FocusDirective } from '../../../../layout/a11y/keyboard-focus/focus.directive';

@Component({
  selector: 'cx-tab-panel',
  templateUrl: './tab-panel.component.html',
  standalone: true,
  imports: [FocusDirective, NgIf, NgTemplateOutlet],
})
export class TabPanelComponent {
  TAB_MODE = TAB_MODE;

  /**
   * Tab object to display content and set attributes to.
   */
  @Input() tab: Tab;

  /**
   * In which layout to set the component (ie. Tab or Accordian).
   * Defaults to "Tab" mode.
   */
  @Input() mode: TAB_MODE = TAB_MODE.TAB;
}
