/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, Input, OnInit } from '@angular/core';
import { PointOfService, RoutingService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ICON_TYPE } from '@spartacus/storefront';
import { StoreFinderService } from '@spartacus/storefinder/core';
import { NgIf, AsyncPipe } from '@angular/common';
import { FeatureDirective } from '@spartacus/core';
import { IconComponent } from '@spartacus/storefront';
import { StoreFinderStoreDescriptionComponent } from '../store-finder-store-description/store-finder-store-description.component';
import { SpinnerComponent } from '@spartacus/storefront';
import { TranslatePipe } from '@spartacus/core';
import { MockTranslatePipe } from '@spartacus/core';

@Component({
  selector: 'cx-store-finder-store',
  templateUrl: './store-finder-store.component.html',
  imports: [
    NgIf,
    FeatureDirective,
    IconComponent,
    StoreFinderStoreDescriptionComponent,
    SpinnerComponent,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class StoreFinderStoreComponent implements OnInit {
  location$: Observable<any>;
  isLoading$: Observable<any>;
  iconTypes = ICON_TYPE;

  @Input() location: PointOfService;
  @Input() disableMap: boolean;

  constructor(
    private storeFinderService: StoreFinderService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {}

  ngOnInit() {
    if (!this.location) {
      this.requestStoresData();
      this.location$ = this.storeFinderService.getFindStoreEntityById();
      this.isLoading$ = this.storeFinderService.getStoresLoading();
    }
  }

  requestStoresData() {
    this.storeFinderService.viewStoreById(this.route.snapshot.params.store);
  }

  goBack(): void {
    this.routingService.go([
      `store-finder/country/${this.route.snapshot.params.country}`,
    ]);
  }
}
