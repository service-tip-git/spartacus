/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  CmsService,
  Page,
  PointOfService,
  RoutingService,
  useFeatureStyles,
} from '@spartacus/core';
import {
  PickupLocationsSearchFacade,
  PointOfServiceNames,
  PreferredStoreFacade,
} from '@spartacus/pickup-in-store/root';
import { StoreFinderFacade } from '@spartacus/storefinder/root';
import { ICON_TYPE } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

const getDirectionsAction = {
  event: 'send',
  name: 'Get Directions',
  ariaLabel: 'cardActions.getDirections',
};

@Component({
  selector: 'cx-my-preferred-store',
  templateUrl: 'my-preferred-store.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyPreferredStoreComponent implements OnInit {
  preferredStore$: Observable<PointOfService>;
  content = {
    header: 'My Store',
  };
  actions = [
    getDirectionsAction,
    {
      event: 'edit',
      name: 'Change Store',
    },
  ];
  openHoursOpen = false;
  readonly ICON_TYPE = ICON_TYPE;
  pointOfService: PointOfService;
  isStoreFinder = false;

  constructor(
    private preferredStoreFacade: PreferredStoreFacade,
    protected pickupLocationsSearchService: PickupLocationsSearchFacade,
    protected routingService: RoutingService,
    protected storeFinderService: StoreFinderFacade,
    protected cmsService: CmsService
  ) {
    this.preferredStore$ = this.preferredStoreFacade.getPreferredStore$().pipe(
      filter((preferredStore) => preferredStore !== null),
      map((preferredStore) => preferredStore as PointOfServiceNames),
      filter((preferredStore) => !!preferredStore.name),
      map((preferredStore) => preferredStore.name),
      tap((preferredStoreName) =>
        this.pickupLocationsSearchService.loadStoreDetails(
          preferredStoreName as string
        )
      ),
      switchMap((preferredStoreName) =>
        this.pickupLocationsSearchService.getStoreDetails(
          preferredStoreName as string
        )
      ),
      tap((store: PointOfService) => {
        this.pointOfService = store;
      })
    );

    useFeatureStyles('a11yViewHoursButtonIconContrast');
    useFeatureStyles('a11yImproveCardActionButtons');
  }

  ngOnInit(): void {
    this.cmsService
      .getCurrentPage()
      .pipe(
        filter<Page>(Boolean),
        take(1),
        tap(
          (cmsPage) =>
            (this.isStoreFinder = cmsPage.pageId === 'storefinderPage')
        ),
        filter(() => this.isStoreFinder),
        tap(() => {
          this.content = {
            header: '',
          };
          this.actions = [getDirectionsAction];
        })
      )
      .subscribe();
  }

  /**
   * Toggle whether the store's opening hours are visible.
   */
  toggleOpenHours(): boolean {
    this.openHoursOpen = !this.openHoursOpen;
    return false;
  }

  changeStore(): void {
    this.routingService.go(['/store-finder']);
  }

  getDirectionsToStore(): void {
    const linkToDirections: string = this.storeFinderService.getDirections(
      this.pointOfService
    );
    window.open(linkToDirections, '_blank', 'noopener,noreferrer');
  }
}
