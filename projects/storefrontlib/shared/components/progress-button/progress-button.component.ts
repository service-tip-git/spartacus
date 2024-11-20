/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MockTranslatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { NgClass, NgIf } from '@angular/common';
@Component({
  selector: 'cx-progress-button',
  templateUrl: './progress-button.component.html',
  standalone: true,
  imports: [NgClass, NgIf, TranslatePipe, MockTranslatePipe],
})
export class ProgressButtonComponent {
  @Input()
  ariaLabel: string = '';

  @Input()
  class: string = '';

  @Input()
  disabled: boolean = false;

  @Input()
  loading: boolean = false;

  @Output()
  clickEvent = new EventEmitter<void>();

  constructor() {
    // Intentional empty constructor
  }
}
