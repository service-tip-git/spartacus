import { TestBed } from '@angular/core/testing';
import { ActiveCartFacade } from '@spartacus/cart/base/root';
import {
  CheckoutDeliveryAddressFacade,
  CheckoutDeliveryModesFacade,
  CheckoutPaymentFacade,
  CheckoutStep,
  CheckoutStepType,
} from '@spartacus/checkout/base/root';
import { RouteConfig, RoutingConfigService } from '@spartacus/core';
import { BehaviorSubject, of } from 'rxjs';
import { CheckoutStepService } from '../services/checkout-step.service';
import { CheckoutStepsSetGuard } from './checkout-steps-set.guard';
import createSpy = jasmine.createSpy;

class MockRoutingConfigService implements Partial<RoutingConfigService> {
  getRouteConfig(stepRoute: string): RouteConfig | undefined {
    if (stepRoute === 'route0') {
      return { paths: ['checkout/route0'] };
    } else if (stepRoute === 'route1') {
      return { paths: ['checkout/route1'] };
    } else if (stepRoute === 'route2') {
      return { paths: ['checkout/route2'] };
    } else if (stepRoute === 'route3') {
      return { paths: ['checkout/route3'] };
    } else if (stepRoute === 'route4') {
      return { paths: ['checkout/route4'] };
    } else if (stepRoute === 'checkout') {
      return { paths: ['checkout'] };
    }
    return undefined;
  }
}

const mockCheckoutSteps: Array<CheckoutStep> = [
  {
    id: 'step1',
    name: 'step 1',
    routeName: 'route1',
    type: [CheckoutStepType.DELIVERY_ADDRESS],
  },
  {
    id: 'step2',
    name: 'step 2',
    routeName: 'route2',
    type: [CheckoutStepType.DELIVERY_MODE],
  },
  {
    id: 'step3',
    name: 'step 3',
    routeName: 'route3',
    type: [CheckoutStepType.PAYMENT_DETAILS],
  },
  {
    id: 'step4',
    name: 'step 4',
    routeName: 'route4',
    type: [CheckoutStepType.DELIVERY_MODE],
  },
];

const testStep: CheckoutStep = {
  id: 'test',
  name: 'test',
  routeName: 'test',
  type: [CheckoutStepType.PAYMENT_DETAILS],
};
class MockCheckoutStepService implements Partial<CheckoutStepService> {
  steps$: BehaviorSubject<CheckoutStep[]> = new BehaviorSubject<CheckoutStep[]>(
    mockCheckoutSteps
  );
  disableEnableStep = createSpy();
  getCheckoutStep = createSpy().and.returnValue(testStep);
}

class MockCheckoutDeliveryAddressFacade
  implements Partial<CheckoutDeliveryAddressFacade>
{
  getDeliveryAddressState = createSpy().and.returnValue(
    of({ loading: false, error: false, data: undefined })
  );
}

class MockCheckoutDeliveryModesFacade
  implements Partial<CheckoutDeliveryModesFacade>
{
  getSelectedDeliveryModeState = createSpy().and.returnValue(
    of({ loading: false, error: false, data: undefined })
  );
  setDeliveryMode = createSpy();
}

class MockCheckoutPaymentFacade implements Partial<CheckoutPaymentFacade> {
  getPaymentDetailsState = createSpy().and.returnValue(
    of({ loading: false, error: false, data: undefined })
  );
}

const hasDeliveryItems$ = new BehaviorSubject<boolean>(false);
class MockCartService implements Partial<ActiveCartFacade> {
  hasDeliveryItems = () => hasDeliveryItems$.asObservable();
}

describe(`CheckoutStepsSetGuard`, () => {
  let guard: CheckoutStepsSetGuard;
  let checkoutDeliveryAddressFacade: CheckoutDeliveryAddressFacade;
  let checkoutDeliveryModesFacade: CheckoutDeliveryModesFacade;
  let checkoutPaymentFacade: CheckoutPaymentFacade;
  let checkoutStepService: CheckoutStepService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CheckoutStepsSetGuard,
        { provide: CheckoutStepService, useClass: MockCheckoutStepService },
        {
          provide: CheckoutDeliveryAddressFacade,
          useClass: MockCheckoutDeliveryAddressFacade,
        },
        {
          provide: CheckoutDeliveryModesFacade,
          useClass: MockCheckoutDeliveryModesFacade,
        },
        {
          provide: CheckoutPaymentFacade,
          useClass: MockCheckoutPaymentFacade,
        },
        { provide: RoutingConfigService, useClass: MockRoutingConfigService },
        { provide: ActiveCartFacade, useClass: MockCartService },
      ],
    });

    guard = TestBed.inject(CheckoutStepsSetGuard);
    checkoutDeliveryAddressFacade = TestBed.inject(
      CheckoutDeliveryAddressFacade
    );
    checkoutDeliveryModesFacade = TestBed.inject(CheckoutDeliveryModesFacade);
    checkoutPaymentFacade = TestBed.inject(CheckoutPaymentFacade);
    checkoutStepService = TestBed.inject(CheckoutStepService);
  });

  describe('should be able to disable/enable delivery address and delivery mode step', () => {
    it('should disable delivery address step', () => {
      expect(checkoutStepService.disableEnableStep).toHaveBeenCalledWith(
        CheckoutStepType.DELIVERY_ADDRESS,
        true
      );
      expect(checkoutStepService.disableEnableStep).toHaveBeenCalledWith(
        CheckoutStepType.DELIVERY_MODE,
        true
      );
      expect(testStep.nameMultiLine).toBeFalsy();
    });

    it('should enable delivery address step', () => {
      hasDeliveryItems$.next(true);
      expect(checkoutStepService.disableEnableStep).toHaveBeenCalledWith(
        CheckoutStepType.DELIVERY_ADDRESS,
        false
      );
      expect(checkoutStepService.disableEnableStep).toHaveBeenCalledWith(
        CheckoutStepType.DELIVERY_MODE,
        false
      );
      expect(testStep.nameMultiLine).toBeTruthy();
    });
  });

  describe('there is no checkout data set yet', () => {
    it('go to step1 (delivery address), should return true (no need cost center for CARD)', (done) => {
      guard
        .canActivate(<any>{ url: ['checkout', 'route1'] })
        .subscribe((result) => {
          expect(result).toBeTruthy();
          done();
        });
    });

    it('go to step2 (delivery mode), should return step1', (done) => {
      guard
        .canActivate(<any>{ url: ['checkout', 'route2'] })
        .subscribe((result) => {
          expect(result.toString()).toEqual('/checkout/route1');
          done();
        });
    });

    it('go to step3 (payment details), should return step2', (done) => {
      guard
        .canActivate(<any>{ url: ['checkout', 'route3'] })
        .subscribe((result) => {
          expect(result.toString()).toEqual('/checkout/route2');
          done();
        });
    });

    it('go to step4 (review details), should return step3', (done) => {
      guard
        .canActivate(<any>{ url: ['checkout', 'route4'] })
        .subscribe((result) => {
          expect(result.toString()).toEqual('/checkout/route3');
          done();
        });
    });
  });

  describe('step1 (delivery address) data set', () => {
    beforeEach(() => {
      checkoutDeliveryAddressFacade.getDeliveryAddressState =
        createSpy().and.returnValue(
          of({ loading: false, error: false, data: { id: 'test-address' } })
        );
    });

    it('go to step2 (delivery mode), should return true', (done) => {
      guard
        .canActivate(<any>{ url: ['checkout', 'route2'] })
        .subscribe((result) => {
          expect(result).toBeTruthy();
          done();
        });
    });

    it('go to step3 (payment details), should return step2', (done) => {
      guard
        .canActivate(<any>{ url: ['checkout', 'route3'] })
        .subscribe((result) => {
          expect(result.toString()).toEqual('/checkout/route2');
          done();
        });
    });

    it('go to step4 (review details), should return step3', (done) => {
      guard
        .canActivate(<any>{ url: ['checkout', 'route4'] })
        .subscribe((result) => {
          expect(result.toString()).toEqual('/checkout/route3');
          done();
        });
    });
  });

  describe('step2 (delivery mode) data set', () => {
    beforeEach(() => {
      checkoutDeliveryModesFacade.getSelectedDeliveryModeState =
        createSpy().and.returnValue(
          of({
            loading: false,
            error: false,
            data: { code: 'test-delivery-mode' },
          })
        );
    });

    it('go to step3 (payment details), should return true', (done) => {
      guard
        .canActivate(<any>{ url: ['checkout', 'route3'] })
        .subscribe((result) => {
          expect(result).toBeTruthy();
          done();
        });
    });

    it('go to step4 (review details), should return step3', (done) => {
      guard
        .canActivate(<any>{ url: ['checkout', 'route4'] })
        .subscribe((result) => {
          expect(result.toString()).toEqual('/checkout/route3');
          done();
        });
    });
  });

  describe('step3 (payment details) data set', () => {
    beforeEach(() => {
      checkoutPaymentFacade.getPaymentDetailsState =
        createSpy().and.returnValue(
          of({ loading: false, error: false, data: { id: 'test-details' } })
        );
    });

    it('go to step4 (review details), should return true', (done) => {
      guard
        .canActivate(<any>{ url: ['checkout', 'route4'] })
        .subscribe((result) => {
          expect(result).toBeTruthy();
          done();
        });
    });

    it('before go to review step, if delivery mode step is disabled, should set it to pickup', (done) => {
      testStep.disabled = true;
      guard.canActivate(<any>{ url: ['checkout', 'route4'] }).subscribe((_) => {
        expect(
          checkoutDeliveryModesFacade.setDeliveryMode
        ).toHaveBeenCalledWith('pickup');
        done();
      });
    });
  });
});
