/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';

@Component({
  selector: 'cx-configurator-show-options',
  templateUrl: './configurator-show-options.component.html',
})
export class ConfiguratorShowOptionsComponent {
  showOptions() {
    console.log('show options');
  }
}
