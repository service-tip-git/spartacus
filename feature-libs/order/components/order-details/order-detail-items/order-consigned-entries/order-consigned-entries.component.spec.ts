import { Component, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { PromotionLocation, OrderEntryGroup } from '@spartacus/cart/base/root';
import { FeatureConfigService, FeaturesConfig, FeaturesConfigModule, I18nTestingModule } from '@spartacus/core';
import { Consignment, Order } from '@spartacus/order/root';
import { CardModule, OutletModule } from '@spartacus/storefront';
import { of } from 'rxjs';
import { OrderConsignedEntriesComponent } from './order-consigned-entries.component';
import { OrderDetailsService } from '../../order-details.service';
import { HierarchyComponentService } from '@spartacus/storefront';
import { AbstractOrderContextModule } from '@spartacus/cart/base/components';

const mockProduct = { product: { code: 'test' } };

const mockOrder: Order = {
  code: '1',
  statusDisplay: 'Shipped',
  consignments: [
    {
      code: 'a00000341',
      status: 'SHIPPED',
      entries: [
        {
          orderEntry: mockProduct,
          quantity: 1,
          shippedQuantity: 1,
        },
      ],
    },
  ],
};

@Component({
  selector: 'cx-consignment-tracking',
  template: '',
})
class MockConsignmentTrackingComponent {
  @Input() consignment: Consignment;
  @Input() orderCode: string;
}

describe('OrderConsignedEntriesComponent', () => {
  let component: OrderConsignedEntriesComponent;
  let fixture: ComponentFixture<OrderConsignedEntriesComponent>;
  let el: DebugElement;
  let mockOrderDetailsService: jasmine.SpyObj<OrderDetailsService>;
  let mockHierarchyService: jasmine.SpyObj<HierarchyComponentService>;
  const mockFeatureConfigService = jasmine.createSpyObj(
    'FeatureConfigService',
    ['isEnabled']
  );

  beforeEach(waitForAsync(() => {
    mockOrderDetailsService = jasmine.createSpyObj('OrderDetailsService', [
      'getEntryGroups',
      'getPickupEntryGroups',
      'getDeliveryEntryGroups',
    ]);
    mockHierarchyService = jasmine.createSpyObj('HierarchyComponentService', [
      'getEntriesFromGroups',
      'getBundlesFromGroups',
    ]);

    TestBed.configureTestingModule({
      imports: [
        CardModule,
        I18nTestingModule,
        RouterTestingModule,
        OutletModule,
        FeaturesConfigModule,
        AbstractOrderContextModule,
      ],
      providers: [
        {
          provide: FeaturesConfig,
          useValue: {
            features: { level: '1.4', consignmentTracking: true },
          },
        },
        { provide: OrderDetailsService, useValue: mockOrderDetailsService },
        { provide: HierarchyComponentService, useValue: mockHierarchyService },
        { provide: FeatureConfigService, useValue: mockFeatureConfigService },
      ],
      declarations: [
        OrderConsignedEntriesComponent,
        MockConsignmentTrackingComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConsignedEntriesComponent);
    el = fixture.debugElement;

    component = fixture.componentInstance;
    component.order = mockOrder;
    component.consignments = mockOrder.consignments || [];
    component.promotionLocation = PromotionLocation.Order;

    // Mock service methods
    mockOrderDetailsService.getEntryGroups.and.returnValue(of([{ entryGroupNumber: 1 }] as OrderEntryGroup[]));
    mockHierarchyService.getEntriesFromGroups.and.returnValue(of([{ entryNumber: 1 }] as any));
    mockOrderDetailsService.getPickupEntryGroups.and.returnValue(of([]));
    mockOrderDetailsService.getDeliveryEntryGroups.and.returnValue(of([]));
    mockHierarchyService.getBundlesFromGroups.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call services and set streams on ngOnInit', () => {
    mockFeatureConfigService.isEnabled.and.returnValue(true);
    component.consignments = [{ deliveryPointOfService: {} }] as Consignment[];

    component.ngOnInit();

    expect(mockOrderDetailsService.getEntryGroups).toHaveBeenCalled();
    expect(mockHierarchyService.getEntriesFromGroups).toHaveBeenCalled();
    expect(mockOrderDetailsService.getPickupEntryGroups).toHaveBeenCalled();
    expect(mockOrderDetailsService.getDeliveryEntryGroups).not.toHaveBeenCalled();
    expect(mockHierarchyService.getBundlesFromGroups).toHaveBeenCalled();
  });


  it('should render order consignment entries', () => {
    fixture.detectChanges();
    expect(el.query(By.css('.cx-list'))).toBeTruthy();
  });

  it('should handle pickup consignments correctly', () => {
    component.consignments = [{ deliveryPointOfService: {} }] as Consignment[];

    component.ngOnInit();
    expect(mockOrderDetailsService.getPickupEntryGroups).toHaveBeenCalled();
  });

  it('should handle shipping consignments correctly', () => {
    component.consignments = [{ deliveryPointOfService: undefined }] as Consignment[];

    component.ngOnInit();
    expect(mockOrderDetailsService.getDeliveryEntryGroups).toHaveBeenCalled();
  });
});
