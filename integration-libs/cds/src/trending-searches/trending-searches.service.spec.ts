/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 */

import { fakeAsync, TestBed, tick, discardPeriodicTasks } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  BaseSiteService,
  RouterState,
  RoutingService,
  WindowRef,
} from '@spartacus/core';
import { TrendingSearchesService } from './trending-searches.service';
import { Observable, of } from 'rxjs';
import { SearchPhrases } from './model';
import { CdsConfig } from '@spartacus/cds';

let routerStateObservable: any = null;

class MockRoutingService {
  getRouterState(): Observable<RouterState> {
    return routerStateObservable;
  }
}

const baseSite = 'main';

class MockBaseSiteService {
  getActive(): Observable<string> {
    return of(baseSite);
  }
}

const mockCDSConfig: CdsConfig = {
  cds: {
    tenant: 'storksfront',
    baseUrl: 'https://api.stage.context.cloud.sap',
    endpoints: {
      strategyProducts: '',
      searchIntelligence:
        '/search-intelligence/v1/sites/${cdsSiteId}/trendingSearches',
    },
  },
};

describe('TrendingSearchesService', () => {
  let trendingSearchesService: TrendingSearchesService;
  let httpMock: HttpTestingController;
  let windowRef: WindowRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: BaseSiteService, useClass: MockBaseSiteService },
        { provide: CdsConfig, useValue: mockCDSConfig },
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },
        WindowRef,
      ],
    });

    trendingSearchesService = TestBed.inject(TrendingSearchesService);
    httpMock = TestBed.inject(HttpTestingController);
    windowRef = TestBed.inject(WindowRef);
  });

  it('should be created', () => {
    expect(trendingSearchesService).toBeTruthy();
  });

  it('should emit trending searches when available', fakeAsync(() => {
    const mockSearchPhrases: SearchPhrases[] = [
      { searchPhrase: 'beauty', count: 10 },
      { searchPhrase: 'books', count: 15 },
    ];

    (<any>windowRef.nativeWindow).Y_TRACKING = {
      config: {
        cdsSiteId: 'main',
      },
    };

    let emittedSearchPhrases: SearchPhrases[] | undefined;
    const subscription = trendingSearchesService.getTrendingSearches().subscribe(
      (searchPhrases) => {
        emittedSearchPhrases = searchPhrases;
      }
    );

    tick(250);

    const mockRequest = httpMock.expectOne((req) =>
      req.url.includes(
        'storksfront-main.api.stage.context.cloud.sap/search-intelligence/v1/sites/main/trendingSearches'
      )
    );
    mockRequest.flush({ searchPhrases: mockSearchPhrases });

    expect(emittedSearchPhrases).toEqual(mockSearchPhrases);

    subscription.unsubscribe();
    trendingSearchesService.ngOnDestroy();

    discardPeriodicTasks();
  }));

  it('should not emit trending searches when not available', fakeAsync(() => {
    (<any>windowRef.nativeWindow).Y_TRACKING = {
      config: {
        cdsSiteId: undefined,
      },
    };

    let emitted = false;
    const subscription = trendingSearchesService.getTrendingSearches().subscribe(() => {
      emitted = true;
    });

    for (let i = 0; i < 100; i++) {
      tick(250);
    }

    expect(emitted).toBeFalse();

    subscription.unsubscribe();
    trendingSearchesService.ngOnDestroy();

    discardPeriodicTasks();
  }));
});
