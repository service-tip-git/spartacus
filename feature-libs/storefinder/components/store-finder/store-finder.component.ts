/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoreFinderHeaderComponent } from '../store-finder-header/store-finder-header.component';
import { FeatureDirective } from '../../../../projects/core/src/features-config/directives/feature.directive';

@Component({
  selector: 'cx-store-finder',
  templateUrl: './store-finder.component.html',
  standalone: true,
  imports: [FeatureDirective, StoreFinderHeaderComponent, RouterOutlet],
})
export class StoreFinderComponent {}
