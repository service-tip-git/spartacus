import { CommonModule } from '@angular/common';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CmsConfig,
  CmsService,
  ConfigModule,
  FeatureConfigService,
  FeaturesConfigModule,
  I18nTestingModule,
  Page,
  RoutingService,
} from '@spartacus/core';
import { StoreModule } from '@spartacus/pickup-in-store/components';
import {
  PickupLocationsSearchFacade,
  PreferredStoreFacade,
} from '@spartacus/pickup-in-store/root';
import { StoreFinderService } from '@spartacus/storefinder/core';
import { StoreFinderFacade } from '@spartacus/storefinder/root';
import { CardModule, IconTestingModule } from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import { MockPickupLocationsSearchService } from '../../../core/facade/pickup-locations-search.service.spec';
import { MockPreferredStoreService } from '../../../core/services/preferred-store.service.spec';
import { MyPreferredStoreComponent } from './my-preferred-store.component';
import { MockFeatureDirective } from 'projects/storefrontlib/shared/test/mock-feature-directive';

class MockRoutingService implements Partial<RoutingService> {
  go = () => Promise.resolve(true);
}

class MockFeatureConfigService {
  isEnabled() {
    return true;
  }
}

class MockCmsService {
  getCurrentPage(): Observable<Page> {
    return of({ pageId: 'storefinderPage' });
  }
  refreshLatestPage() {}
  refreshPageById() {}
  refreshComponent() {}
}

export class MockStoreFinderService implements Partial<StoreFinderService> {
  getStoreLatitude(): number {
    return 1;
  }

  getStoreLongitude(): number {
    return 1;
  }
  getDirections(): string {
    const google_map_url = 'https://www.google.com/maps/dir/Current+Location/';
    const latitude = this.getStoreLatitude();
    const longitude = this.getStoreLongitude();
    return google_map_url + latitude + ',' + longitude;
  }
}

describe('MyPreferredStoreComponent', () => {
  let component: MyPreferredStoreComponent;
  let fixture: ComponentFixture<MyPreferredStoreComponent>;
  let routingService: RoutingService;
  let cmsService: CmsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyPreferredStoreComponent],
      imports: [
        CardModule,
        CommonModule,
        I18nTestingModule,
        IconTestingModule,
        StoreModule,
        ConfigModule.withConfig({
          cmsComponents: {
            MyPreferredStore: {
              component: MyPreferredStoreComponent,
            },
          },
        } as CmsConfig),
      ],
      providers: [
        { provide: PreferredStoreFacade, useClass: MockPreferredStoreService },
        {
          provide: PickupLocationsSearchFacade,
          useClass: MockPickupLocationsSearchService,
        },
        { provide: RoutingService, useClass: MockRoutingService },
        { provide: StoreFinderFacade, useClass: MockStoreFinderService },
        { provide: CmsService, useClass: MockCmsService },
        { provide: FeatureConfigService, useClass: MockFeatureConfigService },
      ],
    })
      .overrideModule(FeaturesConfigModule, {
        set: {
          declarations: [MockFeatureDirective],
          exports: [MockFeatureDirective],
        },
      })
      .compileComponents();
    cmsService = TestBed.inject(CmsService);
    routingService = TestBed.inject(RoutingService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPreferredStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should toggleOpenHours', () => {
    const initialValue = !!component.openHoursOpen;
    component.toggleOpenHours();
    expect(component.openHoursOpen).toEqual(!initialValue);
  });

  it('should changeStore', () => {
    spyOn(routingService, 'go');
    component.changeStore();
    expect(routingService.go).toHaveBeenCalledWith(['/store-finder']);
  });

  it('should show the link', () => {
    spyOn(component, 'getDirectionsToStore');

    const getDirectionLink =
      fixture.debugElement.nativeElement.querySelector('cx-generic-link');
    getDirectionLink.click();

    expect(component.getDirectionsToStore).not.toHaveBeenCalled();
  });

  it('should show action link and a button', () => {
    spyOn(cmsService, 'getCurrentPage').and.returnValue(
      of({ pageId: 'someOtherPage' })
    );
    component.ngOnInit();
    fixture.detectChanges();

    const getDirectionLink =
      fixture.debugElement.nativeElement.querySelector('cx-generic-link');
    expect(getDirectionLink.textContent).toBe('Get Directions');
    const changeStoreButton = fixture.debugElement.nativeElement.querySelector(
      'button.btn-tertiary'
    );
    expect(changeStoreButton.textContent).toEqual(' Change Store ');
  });
});
