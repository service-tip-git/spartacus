import { TestBed } from '@angular/core/testing';
import { RoutingService } from '@spartacus/core';
import { Order, OrderHistoryFacade } from '@spartacus/order/root';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { OrderDetailsService } from './order-details.service';
import { OrderEntryGroup } from '@spartacus/cart/base/root';

const mockOrder: Order = {
  code: '1',
  statusDisplay: 'Shipped',
  deliveryAddress: {
    firstName: 'John',
    lastName: 'Smith',
    line1: 'Buckingham Street 5',
    line2: '1A',
    phone: '(+11) 111 111 111',
    postalCode: 'MA8902',
    town: 'London',
    country: {
      isocode: 'UK',
    },
  },
  deliveryMode: {
    name: 'Standard order-detail-shipping',
    description: '3-5 days',
  },
  paymentInfo: {
    accountHolderName: 'John Smith',
    cardNumber: '************6206',
    expiryMonth: '12',
    expiryYear: '2026',
    cardType: {
      name: 'Visa',
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Smith',
      line1: 'Buckingham Street 5',
      line2: '1A',
      phone: '(+11) 111 111 111',
      postalCode: 'MA8902',
      town: 'London',
      country: {
        isocode: 'UK',
      },
    },
  },
};

const mockEntryGroups: OrderEntryGroup[] = [
  {
    entryGroupNumber: 1,
    entries: [
      {
        entryNumber: 1,
        product: { code: 'P001' },
        quantity: 2,
        deliveryPointOfService: {
          name: 'Store A',
        },
      },
    ],
    entryGroups: [
      {
        entryGroupNumber: 2,
        entries: [
          {
            entryNumber: 2,
            product: { code: 'P002' },
            quantity: 1,
            deliveryPointOfService: {
              name: 'Store B',
            },
          },
        ],
        entryGroups: [],
      },
    ],
  },
  {
    entryGroupNumber: 3,
    entries: [
      {
        entryNumber: 3,
        product: { code: 'P003' },
        quantity: 1,
        deliveryPointOfService: undefined,
      },
    ],
    entryGroups: [],
  },
];

const mockRouterWithoutOrderCode = {
  state: {
    url: '/',
    queryParams: {},
    params: {},
    cmsRequired: false,
  },
};

const mockRouter = {
  state: {
    url: '/',
    queryParams: {},
    params: {
      orderCode: '1',
    },
    cmsRequired: false,
  },
};

const routerSubject = new BehaviorSubject<{ state: object }>(mockRouter);

class MockOrderHistoryFacade implements Partial<OrderHistoryFacade> {
  getOrderDetails(): Observable<Order> {
    return of(mockOrder);
  }
  loadOrderDetails(_orderCode: string): void {}
  clearOrderDetails(): void {}
  getEntryGroups(): Observable<OrderEntryGroup[]> {
    return of(mockEntryGroups);
  }
  getOrderDetailsLoading(): Observable<boolean> {
    return of(false);
  }
}

class MockRoutingService implements Partial<RoutingService> {
  getRouterState(): Observable<any> {
    return routerSubject.asObservable();
  }
}

describe('OrderDetailsService', () => {
  let service: OrderDetailsService;
  let orderHistoryFacade: OrderHistoryFacade;
  let routingService: RoutingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderDetailsService,
        {
          provide: OrderHistoryFacade,
          useClass: MockOrderHistoryFacade,
        },
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },
      ],
    });

    service = TestBed.inject(OrderDetailsService);
    orderHistoryFacade = TestBed.inject(OrderHistoryFacade);
    routingService = TestBed.inject(RoutingService);

    spyOn(routingService, 'getRouterState');
    spyOn(orderHistoryFacade, 'loadOrderDetails');
    spyOn(orderHistoryFacade, 'clearOrderDetails');
    spyOn(orderHistoryFacade, 'getOrderDetails').and.returnValue(of(mockOrder));
    spyOn(orderHistoryFacade, 'getEntryGroups').and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load order details', () => {
    routerSubject.next(mockRouter);
    service.getOrderDetails().subscribe((data) => {
      expect(orderHistoryFacade.loadOrderDetails).toHaveBeenCalledWith('1');
      expect(orderHistoryFacade.getOrderDetails).toHaveBeenCalled();
      expect(data).toBe(mockOrder);
    }).unsubscribe();
  });

  it('should clean order details', () => {
    routerSubject.next(mockRouterWithoutOrderCode);
    service.getOrderDetails().subscribe((data) => {
      expect(orderHistoryFacade.clearOrderDetails).toHaveBeenCalled();
      expect(orderHistoryFacade.getOrderDetails).toHaveBeenCalled();
      expect(data).toBe(mockOrder);
    }).unsubscribe();
  });

  it('should emit distinct orderCode values', () => {
    const mockRouterNewOrderCode = {
      ...mockRouter,
      state: {
        ...mockRouter.state,
        params: {
          orderCode: '123',
        },
      },
    };

    routerSubject.next(mockRouter);

    const orderCodes: string[] = [];
    service.orderCode$.subscribe((data) => {
      orderCodes.push(data);
    });

    expect(orderCodes[0]).toEqual(mockRouter.state.params.orderCode);

    routerSubject.next(mockRouterNewOrderCode);

    expect(orderCodes[1]).toEqual(mockRouterNewOrderCode.state.params.orderCode);
  });

  it('should get entry groups', () => {
    let entryGroups: OrderEntryGroup[] = [];
    service.getEntryGroups().subscribe((data) => (entryGroups = data)).unsubscribe();

    expect(orderHistoryFacade.getEntryGroups).toHaveBeenCalled();
    expect(entryGroups).toEqual(mockEntryGroups);
  });

  it('should filter pickup entry groups', () => {
    let pickupGroups: OrderEntryGroup[] = [];
    service.getPickupEntryGroups().subscribe((data) => (pickupGroups = data)).unsubscribe();

    expect(pickupGroups[0].entryGroupNumber).toBe(1);

    const childGroups = pickupGroups[0].entryGroups || [];
    expect(childGroups.length).toBe(1);
    expect(childGroups[0].entryGroupNumber).toBe(2);
  });

  it('should filter delivery entry groups', () => {
    let deliveryGroups: OrderEntryGroup[] = [];
    service.getDeliveryEntryGroups().subscribe((data) => (deliveryGroups = data)).unsubscribe();

    expect(deliveryGroups.length).toBe(1);
    expect(deliveryGroups[0].entryGroupNumber).toBe(3);
  });



  it('should return correct order loading status', () => {
    const isLoading: boolean[] = [];
    service.isOrderDetailsLoading().subscribe((data) => isLoading.push(data));

    expect(isLoading[0]).toBe(false);
  });
});
