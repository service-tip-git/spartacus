/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, Input } from '@angular/core';
import { PointOfService, useFeatureStyles } from '@spartacus/core';
import { StoreFinderService } from '@spartacus/storefinder/core';
import { AbstractStoreItemComponent } from '../abstract-store-item/abstract-store-item.component';
import { MockTranslatePipe } from '../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../projects/core/src/i18n/translate.pipe';
import { StoreFinderMapComponent } from '../store-finder-map/store-finder-map.component';
import { ScheduleComponent } from '../schedule-component/schedule.component';
import { FeatureDirective } from '../../../../projects/core/src/features-config/directives/feature.directive';
import { NgIf, NgFor, JsonPipe } from '@angular/common';

@Component({
  selector: 'cx-store-finder-store-description',
  templateUrl: './store-finder-store-description.component.html',
  standalone: true,
  imports: [
    NgIf,
    FeatureDirective,
    ScheduleComponent,
    NgFor,
    StoreFinderMapComponent,
    JsonPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class StoreFinderStoreDescriptionComponent extends AbstractStoreItemComponent {
  @Input() location: PointOfService;
  @Input() disableMap: boolean;

  constructor(protected storeFinderService: StoreFinderService) {
    super(storeFinderService);
    useFeatureStyles('a11yStoreFinderOverflow');
  }
}
