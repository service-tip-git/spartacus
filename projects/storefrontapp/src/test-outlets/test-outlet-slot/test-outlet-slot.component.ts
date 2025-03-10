/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';

@Component({
  selector: 'cx-test-outlet-slot',
  templateUrl: './test-outlet-slot.component.html',
  standalone: false,
})
export class TestOutletSlotComponent {
  testSlot1 = 'Section2A';
  testSlot2 = 'Section2B';
}
