import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { I18nTestingModule, RoutingService } from '@spartacus/core';
import { ICON_TYPE } from '@spartacus/storefront';
import { MockFeatureDirective } from 'projects/storefrontlib/shared/test/mock-feature-directive';
import { StoreFinderSearchComponent } from './store-finder-search.component';

const query = {
  queryParams: {
    query: 'address',
  },
};

const keyEvent = {
  key: 'Enter',
};

const badKeyEvent = {
  key: 'Enter95',
};

const mockActivatedRoute = {
  snapshot: {
    params: {},
  },
};

@Pipe({
  name: 'cxUrl',
  standalone: false,
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

@Component({
  selector: 'cx-icon',
  template: '',
  standalone: false,
})
class MockCxIconComponent {
  @Input() type: ICON_TYPE;
}

describe('StoreFinderSearchComponent', () => {
  let component: StoreFinderSearchComponent;
  let fixture: ComponentFixture<StoreFinderSearchComponent>;

  let routingService: RoutingService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, I18nTestingModule],
      declarations: [
        StoreFinderSearchComponent,
        MockUrlPipe,
        MockCxIconComponent,
        MockFeatureDirective,
      ],
      providers: [
        {
          provide: RoutingService,
          useValue: { go: jasmine.createSpy() },
        },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreFinderSearchComponent);
    component = fixture.componentInstance;
    routingService = TestBed.inject(RoutingService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch new query', () => {
    component.searchBox.setValue(query.queryParams.query);
    component.findStores(component.searchBox.value);
    expect(routingService.go).toHaveBeenCalledWith(
      ['store-finder/find'],
      query
    );
  });

  it('should call onKey and dispatch query', () => {
    component.searchBox.setValue(query.queryParams.query);
    component.onKey(keyEvent);
    expect(routingService.go).toHaveBeenCalledWith(
      ['store-finder/find'],
      query
    );
  });

  it('should only call onKey', () => {
    component.onKey(badKeyEvent);
    expect(routingService.go).not.toHaveBeenCalled();
  });

  it('should view stores near by my location', () => {
    component.viewStoresWithMyLoc();
    expect(routingService.go).toHaveBeenCalledWith(['store-finder/find'], {
      queryParams: {
        useMyLocation: true,
      },
    });
  });

  it('should call findStores if search value provided and Enter is an event', () => {
    spyOn(component, 'findStores');
    component.searchBox.setValue(query.queryParams.query);
    component.onKey(keyEvent);
    expect(component.findStores).toHaveBeenCalledWith(query.queryParams.query);
  });
});
