import { Component, Input } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { OrderEntry, OrderEntryGroup } from '@spartacus/cart/base/root';
import { FormErrorsModule } from '@spartacus/storefront';
import { Observable, of } from 'rxjs';
import { OrderAmendService } from '../../amend-order.service';
import { ReturnOrderComponent } from './return-order.component';
import {
  HierarchyComponentService,
  HierarchyNode,
  OutletModule,
} from '@spartacus/storefront';
import {
  FeatureConfigService,
  FeaturesConfigModule,
  I18nTestingModule,
} from '@spartacus/core';
import { OrderReturnService } from '../order-return.service';
const mockForm = new UntypedFormGroup({
  orderCode: new UntypedFormControl('123'),
  entries: new UntypedFormControl([]),
});

class MockOrderAmendService {
  getForm() {
    return of(mockForm);
  }
  getEntries() {}
}

@Component({
  template: '',
  selector: 'cx-amend-order-items',
})
class MockCancelOrReturnItemsComponent {
  @Input() entries: OrderEntry[];
}

@Component({
  template: '',
  selector: 'cx-amend-order-actions',
})
class MockAmendOrderActionComponent implements Partial<OrderReturnService> {
  @Input() orderCode: string;
  @Input() amendOrderForm: UntypedFormGroup;
  @Input() backRoute: string;
  @Input() forwardRoute: string;

  getEntries(): Observable<OrderEntry[]> {
    return of([{}]);
  }
  getOrderEntryGroups(): Observable<OrderEntryGroup[]> {
    return of([{}]);
  }
}
class MockHierachyService {
  getEntriesFromGroups(): Observable<OrderEntry[]> {
    return of([{}]);
  }
  getBundlesFromGroups(): Observable<HierarchyNode[]> {
    return of([]);
  }
}

describe('ReturnOrderComponent', () => {
  let component: ReturnOrderComponent;
  let fixture: ComponentFixture<ReturnOrderComponent>;
  const mockFeatureConfigService = jasmine.createSpyObj(
    'FeatureConfigService',
    ['isEnabled']
  );
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        I18nTestingModule,
        RouterTestingModule,
        FormErrorsModule,
        OutletModule,
        FeaturesConfigModule,
      ],
      providers: [
        { provide: OrderAmendService, useClass: MockOrderAmendService },
        {
          provide: HierarchyComponentService,
          useClass: MockHierachyService,
        },
        { provide: FeatureConfigService, useValue: mockFeatureConfigService },
      ],
      declarations: [
        ReturnOrderComponent,
        MockAmendOrderActionComponent,
        MockCancelOrReturnItemsComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnOrderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an order code', () => {
    component.form$.subscribe().unsubscribe();
    expect(component.orderCode).toEqual('123');
  });

  it('should render two cx-amend-order-actions components', () => {
    fixture.detectChanges();

    expect(
      fixture.debugElement.queryAll(By.css('cx-amend-order-actions')).length
    ).toEqual(2);
  });

  it('should render cx-amend-order-items component', () => {
    fixture.detectChanges();

    expect(
      fixture.debugElement.queryAll(By.css('cx-amend-order-actions')).length
    ).toEqual(2);
  });

  it('should set entries$ and bundles$ if enableBundles feature is enabled', () => {
    mockFeatureConfigService.isEnabled.and.returnValue(true);
    fixture.detectChanges();
    expect(component.entryGroups$).toBeDefined();
    expect(component.entries$).toBeDefined();
    expect(component.bundles$).toBeDefined();
  });
});
