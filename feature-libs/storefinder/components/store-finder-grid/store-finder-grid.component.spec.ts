import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RoutingService, TranslationService } from '@spartacus/core';
import { StoreFinderService } from '@spartacus/storefinder/core';
import { SpinnerModule } from '@spartacus/storefront';
import { MockFeatureDirective } from 'projects/storefrontlib/shared/test/mock-feature-directive';
import { EMPTY, Observable } from 'rxjs';
import { StoreFinderGridComponent } from './store-finder-grid.component';
import createSpy = jasmine.createSpy;

const countryIsoCode = 'CA';
const regionIsoCode = 'CA-QC';

@Component({
  selector: 'cx-store-finder-list-item',
  template: '',
  standalone: false,
})
class MockStoreFinderListItemComponent {
  @Input()
  location;
}

class MockTranslationService implements Partial<TranslationService> {
  translate(): Observable<string> {
    return EMPTY;
  }
}

const mockActivatedRoute = {
  snapshot: {
    params: {},
  },
};

class MockStoreFinderService implements Partial<StoreFinderService> {
  getFindStoresEntities = createSpy('getFindStoresEntities').and.returnValue(
    EMPTY
  );
  getStoresLoading = createSpy('getStoresLoading');
  callFindStoresAction = createSpy('callFindStoresAction');
}

const mockRoutingService = {
  go: createSpy('go'),
};

describe('StoreFinderGridComponent', () => {
  let component: StoreFinderGridComponent;
  let fixture: ComponentFixture<StoreFinderGridComponent>;
  let storeFinderService: StoreFinderService;
  let route: ActivatedRoute;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SpinnerModule],
      declarations: [
        StoreFinderGridComponent,
        MockStoreFinderListItemComponent,
        MockFeatureDirective,
      ],
      providers: [
        { provide: StoreFinderService, useClass: MockStoreFinderService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: RoutingService, useValue: mockRoutingService },
        { provide: TranslationService, useClass: MockTranslationService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreFinderGridComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute);
    storeFinderService = TestBed.inject(StoreFinderService);
  });

  it('should create with country routing parameter', () => {
    route.snapshot.params = { country: countryIsoCode };
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(storeFinderService.callFindStoresAction).toHaveBeenCalledWith(
      route.snapshot.params
    );
  });

  it('should create with country and region routing parameters', () => {
    route.snapshot.params = {
      country: countryIsoCode,
      region: regionIsoCode,
    };
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });
});
