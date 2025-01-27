import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomerCouponAdapter } from './customer-coupon.adapter';
import { CustomerCouponConnector } from './customer-coupon.connector';
import createSpy = jasmine.createSpy;
import { FeatureConfigService } from '../../../features-config/services/feature-config.service';

const PAGE_SIZE = 5;
const currentPage = 1;
const sort = 'byDate';

class MockUserAdapter implements CustomerCouponAdapter {
  getCustomerCoupons = createSpy('getCustomerCoupons').and.callFake((userId) =>
    of(`loadList-${userId}`)
  );
  turnOnNotification = createSpy('turnOnNotification').and.callFake((userId) =>
    of(`subscribe-${userId}`)
  );
  turnOffNotification = createSpy('turnOffNotification').and.returnValue(
    of({})
  );
  claimCustomerCoupon = createSpy('claimCustomerCoupon').and.callFake(
    (userId) => of(`claim-${userId}`)
  );
  claimCustomerCouponWithCodeInBody = createSpy(
    'claimCustomerCouponWithCodeInBody'
  ).and.callFake((userId) => of(`claim-${userId}`));
  disclaimCustomerCoupon = createSpy('disclaimCustomerCoupon').and.callFake(
    (userId) => of(`disclaim-${userId}`)
  );
}

describe('CustomerCouponConnector', () => {
  let service: CustomerCouponConnector;
  let adapter: CustomerCouponAdapter;
  let featureConfigService: FeatureConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: CustomerCouponAdapter, useClass: MockUserAdapter },
      ],
    });

    service = TestBed.inject(CustomerCouponConnector);
    adapter = TestBed.inject(CustomerCouponAdapter);
    featureConfigService = TestBed.inject(FeatureConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCustomerCoupons should call adapter', () => {
    let result;
    service
      .getCustomerCoupons('user-id', PAGE_SIZE, currentPage, sort)
      .subscribe((res) => (result = res));
    expect(result).toEqual('loadList-user-id');
    expect(adapter.getCustomerCoupons).toHaveBeenCalledWith(
      'user-id',
      PAGE_SIZE,
      currentPage,
      sort
    );
  });

  it('turnOnNotification should call adapter', () => {
    let result;
    service
      .turnOnNotification('userId', 'couponCode')
      .subscribe((res) => (result = res));
    expect(result).toEqual('subscribe-userId');
    expect(adapter.turnOnNotification).toHaveBeenCalledWith(
      'userId',
      'couponCode'
    );
  });

  it('turnOffNotification should call adapter', () => {
    let result;
    service
      .turnOffNotification('userId', 'couponCode')
      .subscribe((res) => (result = res));
    expect(result).toEqual({});
    expect(adapter.turnOffNotification).toHaveBeenCalledWith(
      'userId',
      'couponCode'
    );
  });

  it('claimCustomerCoupon should call adapter.claimCustomerCoupon in case enableClaimCustomerCouponWithCodeInRequestBody is disabled', () => {
    let result;
    spyOn(featureConfigService, 'isEnabled').and.returnValue(false);
    service
      .claimCustomerCoupon('userId', 'couponCode')
      .subscribe((res) => (result = res));
    expect(result).toEqual('claim-userId');
    expect(adapter.claimCustomerCoupon).toHaveBeenCalledWith(
      'userId',
      'couponCode'
    );
  });

  it('claimCustomerCoupon should call adapter.claimCustomerCouponWithCodeInBody in case enableClaimCustomerCouponWithCodeInRequestBody is enabled', () => {
    let result;
    spyOn(featureConfigService, 'isEnabled').and.returnValue(true);
    service
      .claimCustomerCoupon('userId', 'couponCode')
      .subscribe((res) => (result = res));
    expect(result).toEqual('claim-userId');
    expect(adapter.claimCustomerCouponWithCodeInBody).toHaveBeenCalledWith(
      'userId',
      'couponCode'
    );
  });

  it('disclaimCustomerCoupon should call adapter', () => {
    let result;
    service
      .disclaimCustomerCoupon('userId', 'couponCode')
      .subscribe((res) => (result = res));
    expect(result).toEqual('disclaim-userId');
    expect(adapter.disclaimCustomerCoupon).toHaveBeenCalledWith(
      'userId',
      'couponCode'
    );
  });
});
