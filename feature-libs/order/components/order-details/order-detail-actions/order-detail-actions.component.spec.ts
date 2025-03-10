import { DebugElement, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FeaturesConfig, I18nTestingModule } from '@spartacus/core';
import { Order } from '@spartacus/order/root';
import { of } from 'rxjs';
import { OrderDetailsService } from '../order-details.service';
import { OrderDetailActionsComponent } from './order-detail-actions.component';

const mockOrder: Order = {
  code: '1',
  created: new Date('2019-02-11T13:02:58+0000'),
  returnable: true,
  cancellable: false,
};

@Pipe({
  name: 'cxUrl',
  standalone: false,
})
class MockUrlPipe implements PipeTransform {
  transform() {}
}

describe('OrderDetailActionsComponent', () => {
  let component: OrderDetailActionsComponent;
  let fixture: ComponentFixture<OrderDetailActionsComponent>;
  let mockOrderDetailsService: OrderDetailsService;
  let el: DebugElement;

  beforeEach(waitForAsync(() => {
    mockOrderDetailsService = <OrderDetailsService>{
      getOrderDetails() {
        return of(mockOrder);
      },
    };

    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      providers: [
        { provide: OrderDetailsService, useValue: mockOrderDetailsService },
        {
          provide: FeaturesConfig,
          useValue: {
            features: { cancellationAndReturn: true },
          },
        },
      ],
      declarations: [OrderDetailActionsComponent, MockUrlPipe],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailActionsComponent);
    el = fixture.debugElement;

    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize ', () => {
    fixture.detectChanges();
    let order: Order;
    component.order$
      .subscribe((value) => {
        order = value;
      })
      .unsubscribe();
    expect(order).toEqual(mockOrder);
  });

  it('should display return button when order is returnable', () => {
    fixture.detectChanges();
    const element: DebugElement = el.queryAll(By.css('a.btn-secondary'))[0];

    expect(element.nativeElement.textContent).toContain(
      'orderDetails.cancellationAndReturn.returnAction'
    );
  });

  it('should not display cancel button when order is not cancellable', () => {
    mockOrder.returnable = false;

    fixture.detectChanges();
    const element: DebugElement = el.queryAll(By.css('a.btn-secondary'))[0];

    expect(element).toBeUndefined();
  });
});
