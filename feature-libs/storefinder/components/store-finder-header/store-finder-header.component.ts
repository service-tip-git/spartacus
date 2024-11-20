/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component } from '@angular/core';
import { MockTranslatePipe } from '@spartacus/core';
import { TranslatePipe } from '@spartacus/core';
import { StoreFinderSearchComponent } from '../store-finder-search/store-finder-search.component';

@Component({
  selector: 'cx-store-finder-header',
  templateUrl: './store-finder-header.component.html',
  standalone: true,
  imports: [StoreFinderSearchComponent, TranslatePipe, MockTranslatePipe],
})
export class StoreFinderHeaderComponent {}
