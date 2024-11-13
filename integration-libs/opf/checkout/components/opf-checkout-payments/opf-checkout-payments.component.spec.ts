import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  GlobalMessageEntities,
  GlobalMessageService,
  GlobalMessageType,
  I18nTestingModule,
  QueryState,
  Translatable,
} from '@spartacus/core';
import {
  OpfActiveConfiguration,
  OpfBaseFacade,
  OpfMetadataModel,
  OpfMetadataStoreService,
  OpfPaymentProviderType,
} from '@spartacus/opf/base/root';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { OpfCheckoutTermsAndConditionsAlertModule } from '../opf-checkout-terms-and-conditions-alert';
import { OpfCheckoutPaymentsComponent } from './opf-checkout-payments.component';

const mockActiveConfigurations: OpfActiveConfiguration[] = [
  {
    id: 1,
    providerType: OpfPaymentProviderType.PAYMENT_GATEWAY,
    displayName: 'Test1',
  },
  {
    id: 2,
    providerType: OpfPaymentProviderType.PAYMENT_GATEWAY,
    displayName: 'Test2',
    logoUrl: 'logoUrl',
  },
  {
    id: 3,
    providerType: OpfPaymentProviderType.PAYMENT_METHOD,
    displayName: 'Test3',
  },
];
class MockOpfBaseFacade implements Partial<OpfBaseFacade> {
  getActiveConfigurationsState(): Observable<
    QueryState<OpfActiveConfiguration[] | undefined>
  > {
    return activeConfigurationsState$.asObservable();
  }
}

const activeConfigurationsState$ = new BehaviorSubject<
  QueryState<OpfActiveConfiguration[] | undefined>
>({
  loading: false,
  error: false,
  data: [],
});

class MockGlobalMessageService implements Partial<GlobalMessageService> {
  get(): Observable<GlobalMessageEntities> {
    return of({});
  }
  add(_: string | Translatable, __: GlobalMessageType, ___?: number): void {}
  remove(_: GlobalMessageType, __?: number): void {}
}

const mockOpfMetadata: OpfMetadataModel = {
  isPaymentInProgress: true,
  selectedPaymentOptionId: 111,
  termsAndConditionsChecked: true,
  defaultSelectedPaymentOptionId: 1,
  paymentSessionId: '111111',
};

describe('OpfCheckoutPaymentsComponent', () => {
  let component: OpfCheckoutPaymentsComponent;
  let fixture: ComponentFixture<OpfCheckoutPaymentsComponent>;
  let globalMessageService: GlobalMessageService;
  let opfMetadataStoreServiceMock: jasmine.SpyObj<OpfMetadataStoreService>;
  let el: DebugElement;

  beforeEach(async () => {
    opfMetadataStoreServiceMock = jasmine.createSpyObj(
      'OpfMetadataStoreService',
      ['getOpfMetadataState', 'updateOpfMetadata']
    );

    opfMetadataStoreServiceMock.getOpfMetadataState.and.returnValue(
      of(mockOpfMetadata)
    );
    await TestBed.configureTestingModule({
      imports: [I18nTestingModule, OpfCheckoutTermsAndConditionsAlertModule],
      declarations: [OpfCheckoutPaymentsComponent],
      providers: [
        {
          provide: OpfBaseFacade,
          useClass: MockOpfBaseFacade,
        },
        { provide: GlobalMessageService, useClass: MockGlobalMessageService },
        {
          provide: OpfMetadataStoreService,
          useValue: opfMetadataStoreServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OpfCheckoutPaymentsComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
  });
  beforeEach(() => {
    globalMessageService = TestBed.inject(GlobalMessageService);
    spyOn(globalMessageService, 'add').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should preselect the payment options', () => {
    fixture.detectChanges();
    expect(component.selectedPaymentId).toBe(
      mockOpfMetadata.selectedPaymentOptionId
    );
  });

  it('should change active payment option', () => {
    component.changePayment(mockActiveConfigurations[2]);
    expect(opfMetadataStoreServiceMock.updateOpfMetadata).toHaveBeenCalledWith({
      selectedPaymentOptionId: component.selectedPaymentId,
    });
  });

  it('should display an error message if active configurations are not available', () => {
    activeConfigurationsState$.next({
      loading: false,
      error: false,
      data: [],
    });

    fixture.detectChanges();

    expect(globalMessageService.add).toHaveBeenCalledWith(
      { key: 'opfCheckout.errors.noActiveConfigurations' },
      GlobalMessageType.MSG_TYPE_ERROR
    );
  });

  it('should display an error message if getting Active Configurations State fails', () => {
    activeConfigurationsState$.next({
      error: new Error('Request failed'),
      loading: false,
      data: undefined,
    });

    fixture.detectChanges();

    expect(globalMessageService.add).toHaveBeenCalledWith(
      { key: 'opfCheckout.errors.loadActiveConfigurations' },
      GlobalMessageType.MSG_TYPE_ERROR
    );
  });

  it('should preselect the default payment option', () => {
    const defaultSelectedPaymentOptionId = 1;

    opfMetadataStoreServiceMock.getOpfMetadataState.and.returnValue(
      of({
        isPaymentInProgress: false,
        selectedPaymentOptionId: undefined,
        termsAndConditionsChecked: true,
        defaultSelectedPaymentOptionId,
        paymentSessionId: '111111',
      })
    );

    fixture.detectChanges();

    expect(component.selectedPaymentId).toBe(defaultSelectedPaymentOptionId);
  });

  it('should render payment provider logo', () => {
    activeConfigurationsState$.next({
      loading: false,
      error: false,
      data: mockActiveConfigurations,
    });

    fixture.detectChanges();

    mockActiveConfigurations.forEach((configuration) => {
      const logoElement = el.query(
        By.css(
          'label[for=paymentId-' + configuration.id + ']  .cx-payment-logo'
        )
      );

      if (configuration?.logoUrl) {
        expect(logoElement).toBeTruthy();
        expect(logoElement.nativeElement.attributes['alt'].value).toBe(
          configuration.displayName
        );
        expect(logoElement.nativeElement.attributes['src'].value).toBe(
          configuration.logoUrl
        );
      } else {
        expect(logoElement).toBeFalsy();
      }
    });
  });
});
