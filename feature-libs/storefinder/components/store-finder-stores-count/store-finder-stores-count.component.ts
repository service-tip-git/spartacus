/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnInit, Optional, inject } from '@angular/core';
import { RoutingService, useFeatureStyles } from '@spartacus/core';
import { StoreFinderService } from '@spartacus/storefinder/core';
import { Observable } from 'rxjs';
import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { FeatureDirective } from '@spartacus/core';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '@spartacus/storefront';
import { TranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-store-finder-stores-count',
  templateUrl: './store-finder-stores-count.component.html',
  imports: [
    NgIf,
    FeatureDirective,
    NgFor,
    RouterLink,
    NgClass,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
    TranslatePipe,
  ],
})
export class StoreFinderStoresCountComponent implements OnInit {
  // TODO: CXSPA-6884 Make service required in next major.
  @Optional() protected routingService? = inject(RoutingService, {
    optional: true,
  });
  locations$: Observable<any>;
  isLoading$: Observable<boolean>;

  constructor(private storeFinderService: StoreFinderService) {
    useFeatureStyles('a11yStoreFinderAlerts');
  }

  ngOnInit() {
    this.storeFinderService.viewAllStores();
    this.locations$ = this.storeFinderService.getViewAllStoresEntities();
    this.isLoading$ = this.storeFinderService.getViewAllStoresLoading();
  }

  navigateToLocation(isoCode: string, event?: Event): void {
    if (this.routingService) {
      event?.preventDefault();
      this.routingService.go(['/store-finder/country', isoCode]);
    }
  }
}
