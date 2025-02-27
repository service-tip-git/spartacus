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
import { ICON_TYPE } from '@spartacus/storefront';
import { Configurator } from '../../core/model/configurator.model';

@Component({
  selector: 'cx-configurator-conflict-description',
  templateUrl: './configurator-conflict-description.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ConfiguratorConflictDescriptionComponent {
  @Input() currentGroup: Configurator.Group;

  groupType = Configurator.GroupType;
  iconTypes = ICON_TYPE;

  @HostBinding('tabindex') tabindex = '0';
  @HostBinding('role') role = 'note';

  constructor() {
    // Intentional empty constructor
  }

  /**
   * Verifies whether the  conflict description should be displayed for the current group.
   *
   * @param {Configurator.Group} group - Current group
   * @return {boolean} - 'True' if the conflict description should be displayed, otherwise 'false'.
   */
  displayConflictDescription(group: Configurator.Group): boolean {
    return group.groupType === Configurator.GroupType.CONFLICT_GROUP;
  }
}
