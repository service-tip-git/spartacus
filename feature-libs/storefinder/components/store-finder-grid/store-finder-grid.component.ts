/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeoPoint, useFeatureStyles } from '@spartacus/core';
import { StoreFinderService } from '@spartacus/storefinder/core';
import { Observable } from 'rxjs';
import { MockTranslatePipe } from '../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../projects/core/src/i18n/translate.pipe';
import { SpinnerComponent } from '../../../../projects/storefrontlib/shared/components/spinner/spinner.component';
import { StoreFinderListItemComponent } from '../store-finder-list-item/store-finder-list-item.component';
import { FeatureDirective } from '../../../../projects/core/src/features-config/directives/feature.directive';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-store-finder-grid',
  templateUrl: './store-finder-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    FeatureDirective,
    NgFor,
    StoreFinderListItemComponent,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class StoreFinderGridComponent implements OnInit {
  defaultLocation: GeoPoint;
  country: string;
  region: string;
  locations$: any;
  isLoading$: Observable<boolean>;

  constructor(
    private storeFinderService: StoreFinderService,
    private route: ActivatedRoute
  ) {
    useFeatureStyles('a11yStoreFinderAlerts');
  }

  ngOnInit() {
    this.isLoading$ = this.storeFinderService.getStoresLoading();
    this.locations$ = this.storeFinderService.getFindStoresEntities();
    this.defaultLocation = {};
    this.findStores();
  }

  protected findStores(): void {
    if (this.route.snapshot.params.country) {
      this.storeFinderService.callFindStoresAction(this.route.snapshot.params);
    }
  }
}
