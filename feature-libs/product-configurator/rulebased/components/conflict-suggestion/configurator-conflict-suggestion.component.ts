/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { Configurator } from '../../core/model/configurator.model';

@Component({
  selector: 'cx-configurator-conflict-suggestion',
  templateUrl: './configurator-conflict-suggestion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ConfiguratorConflictSuggestionComponent {
  @Input() currentGroup: Configurator.Group;
  @Input() attribute: Configurator.Attribute;
  @Input() suggestionNumber: number;

  groupType = Configurator.GroupType;

  @HostBinding('tabindex') tabindex = '0';
  @HostBinding('role') role = 'note';

  constructor() {
    // Intentional empty constructor
  }

  /**
   * Verifies whether the conflict suggestion should be displayed for the current group.
   *
   * @param {Configurator.Group} group - Current group
   * @return {boolean} - 'True' if the conflict description should be displayed, otherwise 'false'.
   */
  displayConflictSuggestion(group: Configurator.Group): boolean {
    return group.groupType === Configurator.GroupType.CONFLICT_GROUP &&
      group.attributes
      ? group.attributes.length > 0
      : false;
  }

  createSuggestionUiKey(): string {
    return 'suggestion--' + this.suggestionNumber;
  }
}
