/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { FeatureDirective } from '@spartacus/core';
import { StoreFinderHeaderComponent } from '../store-finder-header/store-finder-header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cx-store-finder',
  templateUrl: './store-finder.component.html',
  imports: [FeatureDirective, StoreFinderHeaderComponent, RouterOutlet],
})
export class StoreFinderComponent {}
