import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { I18nTestingModule, PointOfService } from '@spartacus/core';
import {
  GoogleMapRendererService,
  StoreFinderService,
} from '@spartacus/storefinder/core';
import { SpinnerModule } from '@spartacus/storefront';
import { EMPTY } from 'rxjs';
import { StoreFinderMapComponent } from '../../store-finder-map/store-finder-map.component';
import { StoreFinderListComponent } from './store-finder-list.component';
import { LocationDisplayMode } from './store-finder-list.model';
import createSpy = jasmine.createSpy;

const location: PointOfService = {
  displayName: 'Test Store',
};
const stores: Array<PointOfService> = [location];
const locations = { stores: stores, pagination: { currentPage: 0 } };
const displayModes = LocationDisplayMode;

class StoreFinderServiceMock implements Partial<StoreFinderService> {
  getFindStoresEntities = createSpy('getFindStoresEntities').and.returnValue(
    EMPTY
  );
  getStoresLoading = createSpy('getStoresLoading');
  callFindStoresAction = createSpy('callFindStoresAction');
  getStoreLatitude(_location: any): number {
    return 35.528984;
  }

  getStoreLongitude(_location: any): number {
    return 139.700168;
  }
}

class GoogleMapRendererServiceMock {
  centerMap(_latitute: number, _longitude: number) {}
  renderMap() {}
}

describe('StoreFinderDisplayListComponent', () => {
  let component: StoreFinderListComponent;
  let fixture: ComponentFixture<StoreFinderListComponent>;
  let storeMapComponent: StoreFinderMapComponent;
  let storeFinderService: StoreFinderService;
  let googleMapRendererService: GoogleMapRendererService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [StoreFinderListComponent, StoreFinderMapComponent],
      imports: [SpinnerModule, I18nTestingModule],
      providers: [
        {
          provide: GoogleMapRendererService,
          useClass: GoogleMapRendererServiceMock,
        },
        { provide: StoreFinderService, useClass: StoreFinderServiceMock },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreFinderListComponent);
    component = fixture.componentInstance;
    storeFinderService = TestBed.inject(StoreFinderService);
    googleMapRendererService = TestBed.inject(GoogleMapRendererService);

    spyOn(storeFinderService, 'getStoreLatitude');
    spyOn(storeFinderService, 'getStoreLongitude');
    spyOn(googleMapRendererService, 'centerMap');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should center store on map', () => {
    component.locations = locations;
    fixture.detectChanges();
    storeMapComponent = fixture.debugElement.query(
      By.css('cx-store-finder-map')
    ).componentInstance;
    spyOn(storeMapComponent, 'centerMap').and.callThrough();

    component.centerStoreOnMapByIndex(0, location);

    expect(storeMapComponent.centerMap).toHaveBeenCalled();
    expect(storeFinderService.getStoreLatitude).toHaveBeenCalled();
    expect(storeFinderService.getStoreLongitude).toHaveBeenCalled();
  });

  it('should select store from list', () => {
    const itemNumber = 4;
    const storeListItemMock = { scrollIntoView: function () {} };
    spyOn(document, 'getElementById').and.returnValue(storeListItemMock as any);
    spyOn(storeListItemMock, 'scrollIntoView');

    component.selectStoreItemList(itemNumber);

    expect(document.getElementById).toHaveBeenCalledWith('item-' + itemNumber);
    expect(storeListItemMock.scrollIntoView).toHaveBeenCalled();
  });

  it('should show store details', () => {
    component.locations = locations;
    fixture.detectChanges();
    expect(component.isDetailsModeVisible).toBe(false);

    component.centerStoreOnMapByIndex(0, location);
    fixture.detectChanges();
    expect(component.isDetailsModeVisible).toBe(true);
    expect(component.storeDetails).not.toBe(null);
  });

  it('should close store details', () => {
    component.locations = locations;
    fixture.detectChanges();

    component.centerStoreOnMapByIndex(0, location);
    fixture.detectChanges();
    expect(component.isDetailsModeVisible).toBe(true);

    component.hideStoreDetails();
    expect(component.isDetailsModeVisible).toBe(false);
  });

  it('should "setDisplayMode" switch active display mode', () => {
    expect(component.activeDisplayMode).toBe(displayModes.LIST_VIEW);
    component.setDisplayMode(displayModes.MAP_VIEW);
    expect(component.activeDisplayMode).toBe(displayModes.MAP_VIEW);
  });

  it('should "isDisplayModeActive" return valid boolean flag', () => {
    component.setDisplayMode(displayModes.MAP_VIEW);

    expect(component.isDisplayModeActive(displayModes.MAP_VIEW)).toBeTruthy();
    expect(component.isDisplayModeActive(displayModes.LIST_VIEW)).toBeFalsy();
  });
});
