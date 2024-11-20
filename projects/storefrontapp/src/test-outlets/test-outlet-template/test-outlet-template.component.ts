/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { OutletRefDirective } from '../../../../storefrontlib/cms-structure/outlet/outlet-ref/outlet-ref.directive';
import { PageLayoutComponent } from '../../../../storefrontlib/cms-structure/page/page-layout/page-layout.component';

@Component({
  selector: 'cx-test-outlet-template',
  templateUrl: './test-outlet-template.component.html',
  standalone: true,
  imports: [PageLayoutComponent, OutletRefDirective, AsyncPipe, JsonPipe],
})
export class TestOutletTemplateComponent {
  testTemplate = 'ContentPage1Template';
}
