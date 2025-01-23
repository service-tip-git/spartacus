import {
  DebugElement,
  ElementRef,
  Pipe,
  PipeTransform,
  ViewContainerRef,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { I18nTestingModule } from '@spartacus/core';
import { Consignment, OrderHistoryFacade } from '@spartacus/order/root';
import {
  LaunchDialogService,
  LAUNCH_CALLER,
  SpinnerModule,
} from '@spartacus/storefront';
import { EMPTY, of } from 'rxjs';
import { ConsignmentTrackingComponent } from './consignment-tracking.component';

const consignmentStatus: string[] = [
  'DELIVERING',
  'DELIVERY_REJECTED',
  'DELIVERY_COMPLETED',
  'IN_TRANSIT',
  'SHIPPED',
];

const mockConsignment: Consignment = {
  code: 'a00000341',
  statusDate: new Date('2019-02-11T13:05:12+0000'),
  entries: [{ orderEntry: {}, quantity: 1, shippedQuantity: 1 }],
};

@Pipe({
  name: 'cxTranslateUrl',
  standalone: false,
})
class MockTranslateUrlPipe implements PipeTransform {
  transform(): any {}
}

class MockLaunchDialogService implements Partial<LaunchDialogService> {
  openDialog(
    _caller: LAUNCH_CALLER,
    _openElement?: ElementRef,
    _vcr?: ViewContainerRef
  ) {
    return EMPTY;
  }
}

describe('ConsignmentTrackingComponent', () => {
  let component: ConsignmentTrackingComponent;
  let fixture: ComponentFixture<ConsignmentTrackingComponent>;
  let el: DebugElement;
  let launchDialogService: LaunchDialogService;

  const arrayEqyals = (array1: string[], array2: string[]) => {
    let equals = false;
    if (array1 && array2) {
      equals =
        array1.length === array2.length &&
        array1.every((element) => {
          return array2.includes(element);
        });
    }
    return equals;
  };

  const userOrderService = jasmine.createSpyObj('UserOrderService', [
    'loadConsignmentTracking',
    'getConsignmentTracking',
    'clearConsignmentTracking',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SpinnerModule, I18nTestingModule],
      declarations: [ConsignmentTrackingComponent, MockTranslateUrlPipe],
      providers: [
        { provide: LaunchDialogService, useClass: MockLaunchDialogService },
        { provide: OrderHistoryFacade, useValue: userOrderService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentTrackingComponent);
    launchDialogService = TestBed.inject(LaunchDialogService);
    userOrderService.getConsignmentTracking.and.returnValue(
      of({ trackingID: '1234567890' })
    );
    userOrderService.loadConsignmentTracking.and.callFake(
      (_orderCode: string, _consignmentCode: string) => {}
    );
    el = fixture.debugElement;
    component = fixture.componentInstance;
    component.consignment = mockConsignment;
    component.orderCode = 'test_order_id';

    userOrderService.getConsignmentTracking.and.returnValue(
      of(mockConsignment)
    );
    userOrderService.clearConsignmentTracking.and.callFake(() => {});
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not display tracking package button when there is no consignment', () => {
    component.consignment = undefined;
    fixture.detectChanges();
    expect(
      arrayEqyals(consignmentStatus, component.consignmentStatus)
    ).toBeTruthy();
    expect(consignmentStatus.includes(status)).toBeFalsy();
    expect(el.query(By.css('.btn-track'))).toBeFalsy();
  });

  it('should not display tracking package button when status not match', () => {
    const status = 'WAITING';
    mockConsignment.status = status;
    fixture.detectChanges();
    expect(
      arrayEqyals(consignmentStatus, component.consignmentStatus)
    ).toBeTruthy();
    expect(consignmentStatus.includes(status)).toBeFalsy();
    expect(el.query(By.css('.btn-track'))).toBeFalsy();
  });

  it('should not display tracking package button when consignment without status', () => {
    mockConsignment.status = undefined;
    fixture.detectChanges();
    expect(
      arrayEqyals(consignmentStatus, component.consignmentStatus)
    ).toBeTruthy();
    expect(consignmentStatus.includes(status)).toBeFalsy();
    expect(el.query(By.css('.btn-track'))).toBeFalsy();
  });

  it('should display tracking package button', () => {
    consignmentStatus.forEach((status) => {
      mockConsignment.status = status;
      fixture.detectChanges();
      expect(el.query(By.css('.btn-track'))).toBeTruthy();
    });

    expect(
      arrayEqyals(consignmentStatus, component.consignmentStatus)
    ).toBeTruthy();
  });

  it('should be able to open dialog', () => {
    spyOn(launchDialogService, 'openDialog').and.stub();
    mockConsignment.status = consignmentStatus[0];
    fixture.detectChanges();

    el.query(By.css('.btn-track')).nativeElement.click();

    expect(userOrderService.loadConsignmentTracking).toHaveBeenCalledWith(
      component.orderCode,
      mockConsignment.code
    );
    expect(launchDialogService.openDialog).toHaveBeenCalled();
  });
});
