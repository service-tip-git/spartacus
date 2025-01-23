import { Component, Input, Type } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { UntypedFormControl } from '@angular/forms';
import {
  ActiveCartFacade,
  Cart,
  MultiCartFacade,
  OrderEntry,
} from '@spartacus/cart/base/root';
import {
  GlobalMessageService,
  I18nTestingModule,
  RouterState,
  RoutingService,
} from '@spartacus/core';
import { Order, OrderHistoryFacade } from '@spartacus/order/root';
import {
  CommonConfigurator,
  CommonConfiguratorUtilsService,
  ConfiguratorRouter,
  ConfiguratorRouterExtractorService,
  ConfiguratorType,
} from '@spartacus/product-configurator/common';
import {
  ICON_TYPE,
  IntersectionService,
  KeyboardFocusService,
} from '@spartacus/storefront';
import { MockFeatureLevelDirective } from 'projects/storefrontlib/shared/test/mock-feature-level-directive';
import { Observable, of } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { CommonConfiguratorTestUtilsService } from '../../../common/testing/common-configurator-test-utils.service';
import { ConfiguratorCartService } from '../../core/facade/configurator-cart.service';
import { ConfiguratorCommonsService } from '../../core/facade/configurator-commons.service';
import { ConfiguratorGroupsService } from '../../core/facade/configurator-groups.service';
import { Configurator } from '../../core/model/configurator.model';
import { ConfiguratorQuantityService } from '../../core/services/configurator-quantity.service';
import * as ConfigurationTestData from '../../testing/configurator-test-data';
import { ConfiguratorStorefrontUtilsService } from '../service/configurator-storefront-utils.service';
import { ConfiguratorAddToCartButtonComponent } from './configurator-add-to-cart-button.component';
import createSpy = jasmine.createSpy;

const CART_ENTRY_KEY = '001+1';
const ORDER_ENTRY_KEY = '002+1';
const PRODUCT_ENTRY_KEY = '003+1';
const QUOTE_CODE = '004';
const QUOTE_ENTRY_KEY = QUOTE_CODE + '+1';
const QUANTITY = 99;
const QUANTITY_CHANGED = 7;

const configuratorType = ConfiguratorType.VARIANT;

const ROUTE_CONFIGURATION = 'configureCPQCONFIGURATOR';
const ROUTE_OVERVIEW = 'configureOverviewCPQCONFIGURATOR';

const mockProductConfigurationWithoutPriceSummary =
  ConfigurationTestData.productConfigurationWithConflicts;

const mockProductConfigurationWithoutBasePrice =
  ConfigurationTestData.productConfigurationWithoutBasePrice;

const mockProductConfigurationWithoutSelectedOptions =
  ConfigurationTestData.productConfigurationWithoutSelectedOptions;

const mockProductConfigurationWithoutTotalPrice =
  ConfigurationTestData.mockProductConfigurationWithoutTotalPrice;

const mockProductConfigurationWithPriceSummaryButNoPrices =
  ConfigurationTestData.mockProductConfigurationWithPriceSummaryButNoPrices;

const navParamsOverview: any = {
  cxRoute: 'configureOverview' + configuratorType,
  params: { ownerType: 'cartEntry', entityKey: CART_ENTRY_KEY },
};

const queryParams: any = {
  queryParams: {
    productCode: ConfigurationTestData.PRODUCT_CODE,
  },
};

const mockOrder: Order = {
  code: '1',
};

@Component({
  selector: 'cx-icon',
  template: '',
  standalone: false,
})
class MockCxIconComponent {
  @Input() type: ICON_TYPE;
}

@Component({
  template: '',
  selector: 'cx-item-counter',
  standalone: false,
})
class MockItemCounterComponent {
  @Input() min: number;
  @Input() max: number;
  @Input() step: any;
  @Input() control: any;
  @Input() allowZero: boolean;
}

let component: ConfiguratorAddToCartButtonComponent;
let fixture: ComponentFixture<ConfiguratorAddToCartButtonComponent>;
let htmlElem: HTMLElement;
let routerStateObservable: Observable<any>;
let productConfigurationObservable: Observable<any>;
let pendingChangesObservable: Observable<any>;
let elementMock: { style: any };
let orderEntryObservable: Observable<any>;
let mockProductConfiguration: Configurator.Configuration;
let mockOwner: CommonConfigurator.Owner;
let mockRouterData: ConfiguratorRouter.Data;
let mockRouterState: any;

function initialize() {
  routerStateObservable = of(mockRouterState);
  productConfigurationObservable = of(mockProductConfiguration);
  orderEntryObservable = of(mockOrderEntry);
  fixture = TestBed.createComponent(ConfiguratorAddToCartButtonComponent);
  component = fixture.componentInstance;
  htmlElem = fixture.nativeElement;
  component.quantityControl = new UntypedFormControl(1);
  fixture.detectChanges();
}

function initTestData() {
  mockProductConfiguration = structuredClone(
    ConfigurationTestData.productConfiguration
  );
  mockOwner = structuredClone(ConfigurationTestData.productConfiguration.owner);
  mockProductConfiguration.owner = mockOwner;
  mockRouterData = {
    pageType: ConfiguratorRouter.PageType.CONFIGURATION,
    isOwnerCartEntry: false,
    owner: mockOwner,
    displayOnly: false,
  };
  mockRouterState = {
    state: {
      semanticRoute: ROUTE_CONFIGURATION,
      params: {
        entityKey: ConfigurationTestData.PRODUCT_CODE,
        ownerType: CommonConfigurator.OwnerType.PRODUCT,
      },
      queryParams: {},
    },
  };

  cart.quoteCode = QUOTE_CODE;
  elementMock = {
    style: {
      position: '',
    },
  };
}

class MockGlobalMessageService {
  add(): void {}
}

class MockConfiguratorQuantityService {
  getQuantity(): Observable<number> {
    return of(QUANTITY);
  }

  setQuantity(): void {}
}

class MockConfiguratorCommonsService {
  getConfiguration(): Observable<Configurator.Configuration> {
    return productConfigurationObservable;
  }

  getOrCreateConfiguration(): Observable<Configurator.Configuration> {
    return productConfigurationObservable;
  }

  getConfigurationWithOverview(): Observable<Configurator.Configuration> {
    return productConfigurationObservable;
  }

  removeConfiguration() {}

  removeUiState() {}

  hasPendingChanges() {
    return pendingChangesObservable;
  }
}

const mockOrderEntry: OrderEntry = { orderCode: '123' };

class MockConfiguratorCartService {
  updateCartEntry() {}

  addToCart() {}

  getEntry() {
    return orderEntryObservable;
  }
}

class MockConfiguratorGroupsService {
  setGroupStatusVisited() {}
}

class MockCommonConfiguratorUtilsService {
  decomposeOwnerId(ownerId: string): any {
    const parts: string[] = ownerId.split('+');
    const result = { documentId: parts[0], entryNumber: parts[1] };
    return result;
  }
}

class MockOrderHistoryFacade implements Partial<OrderHistoryFacade> {
  loadOrderDetails() {}

  getOrderDetails(): Observable<Order> {
    return of(mockOrder);
  }
}

class MockConfiguratorRouterExtractorService {
  extractRouterData(): Observable<ConfiguratorRouter.Data> {
    return of(mockRouterData);
  }
}

class MockIntersectionService {
  isIntersecting(): Observable<boolean> {
    return of(false);
  }
}

const cart: Cart = { quoteCode: QUOTE_CODE };

class MockMultiCartFacade implements Partial<MultiCartFacade> {
  getCart(): Observable<Cart> {
    return of(cart);
  }
}

function setRouterTestDataCartBoundAndConfigPage() {
  mockRouterState.state.params = {
    entityKey: CART_ENTRY_KEY,
    ownerType: CommonConfigurator.OwnerType.CART_ENTRY,
  };
  mockRouterState.state.semanticRoute = ROUTE_CONFIGURATION;
  mockRouterData.isOwnerCartEntry = true;
  mockRouterData.owner.type = CommonConfigurator.OwnerType.CART_ENTRY;
  mockRouterData.owner.id = CART_ENTRY_KEY;
  mockRouterData.pageType = ConfiguratorRouter.PageType.CONFIGURATION;
}

function setRouterTestDataProductBoundAndConfigPage() {
  mockRouterState.state.params = {
    entityKey: ConfigurationTestData.PRODUCT_CODE,
    ownerType: CommonConfigurator.OwnerType.PRODUCT,
  };
  mockRouterState.state.semanticRoute = ROUTE_CONFIGURATION;
  mockRouterData.isOwnerCartEntry = false;
  mockRouterData.owner.type = CommonConfigurator.OwnerType.PRODUCT;
  mockRouterData.owner.id = ConfigurationTestData.PRODUCT_CODE;
  mockRouterData.pageType = ConfiguratorRouter.PageType.CONFIGURATION;
}

function setRouterTestDataReadOnlyOrder() {
  mockRouterState.state.params = {
    entityKey: ORDER_ENTRY_KEY,
    ownerType: CommonConfigurator.OwnerType.ORDER_ENTRY,
  };
  mockRouterState.state.semanticRoute = ROUTE_OVERVIEW;
  mockRouterData.isOwnerCartEntry = false;
  mockRouterData.owner.type = CommonConfigurator.OwnerType.ORDER_ENTRY;
  mockRouterData.owner.id = ORDER_ENTRY_KEY;
  mockRouterData.pageType = ConfiguratorRouter.PageType.OVERVIEW;
  mockRouterData.displayOnly = true;
}

function setRouterTestDataReadOnlyQuote() {
  mockRouterState.state.params = {
    entityKey: QUOTE_ENTRY_KEY,
    ownerType: CommonConfigurator.OwnerType.QUOTE_ENTRY,
  };
  mockRouterState.state.semanticRoute = ROUTE_OVERVIEW;
  mockRouterData.isOwnerCartEntry = false;
  mockRouterData.owner.type = CommonConfigurator.OwnerType.QUOTE_ENTRY;
  mockRouterData.owner.id = QUOTE_ENTRY_KEY;
  mockRouterData.pageType = ConfiguratorRouter.PageType.OVERVIEW;
  mockRouterData.displayOnly = true;
}

function setRouterTestDataReadOnlyCart() {
  mockRouterState.state.params = {
    entityKey: QUOTE_ENTRY_KEY,
    ownerType: CommonConfigurator.OwnerType.CART_ENTRY,
  };
  mockRouterState.state.semanticRoute = ROUTE_OVERVIEW;
  mockRouterData.isOwnerCartEntry = false;
  mockRouterData.owner.type = CommonConfigurator.OwnerType.CART_ENTRY;
  mockRouterData.owner.id = QUOTE_ENTRY_KEY;
  mockRouterData.pageType = ConfiguratorRouter.PageType.OVERVIEW;
  mockRouterData.displayOnly = true;
  mockRouterData.navigateToCheckout = false;
}

function setRouterTestDataReadOnlyCheckout() {
  mockRouterState.state.params = {
    entityKey: QUOTE_ENTRY_KEY,
    ownerType: CommonConfigurator.OwnerType.CART_ENTRY,
  };
  mockRouterState.state.semanticRoute = ROUTE_OVERVIEW;
  mockRouterData.isOwnerCartEntry = false;
  mockRouterData.owner.type = CommonConfigurator.OwnerType.CART_ENTRY;
  mockRouterData.owner.id = QUOTE_ENTRY_KEY;
  mockRouterData.pageType = ConfiguratorRouter.PageType.OVERVIEW;
  mockRouterData.displayOnly = true;
  mockRouterData.navigateToCheckout = true;
}

function setRouterTestDataReadOnlySavedCart() {
  mockRouterState.state.params = {
    entityKey: QUOTE_ENTRY_KEY,
    ownerType: CommonConfigurator.OwnerType.SAVED_CART_ENTRY,
  };
  mockRouterState.state.semanticRoute = ROUTE_OVERVIEW;
  mockRouterData.isOwnerCartEntry = false;
  mockRouterData.owner.type = CommonConfigurator.OwnerType.SAVED_CART_ENTRY;
  mockRouterData.owner.id = QUOTE_ENTRY_KEY;
  mockRouterData.pageType = ConfiguratorRouter.PageType.OVERVIEW;
  mockRouterData.displayOnly = true;
}

function setRouterTestDataReadOnlyProduct() {
  mockRouterState.state.params = {
    entityKey: ORDER_ENTRY_KEY,
    ownerType: CommonConfigurator.OwnerType.PRODUCT,
  };
  mockRouterState.state.semanticRoute = ROUTE_OVERVIEW;
  mockRouterData.isOwnerCartEntry = false;
  mockRouterData.owner.type = CommonConfigurator.OwnerType.PRODUCT;
  mockRouterData.owner.id = PRODUCT_ENTRY_KEY;
  mockRouterData.pageType = ConfiguratorRouter.PageType.OVERVIEW;
  mockRouterData.displayOnly = true;
}

function performAddToCartOnOverview() {
  setRouterTestDataProductBoundAndConfigPage();
  mockRouterState.state.semanticRoute = ROUTE_OVERVIEW;
  mockRouterData.pageType = ConfiguratorRouter.PageType.OVERVIEW;
  mockRouterData.productCode = mockProductConfiguration.productCode;
  initialize();
  component.onAddToCart(mockProductConfiguration, mockRouterData);
}

function performUpdateCart() {
  ensureCartBound();
  component.onAddToCart(mockProductConfiguration, mockRouterData);
}

function ensureCartBound() {
  setRouterTestDataCartBoundAndConfigPage();
  mockOwner.id = CART_ENTRY_KEY;
  initialize();
}

function ensureCartBoundAndOnOverview() {
  setRouterTestDataCartBoundAndConfigPage();
  mockRouterState.state.semanticRoute = ROUTE_OVERVIEW;
  mockRouterData.pageType = ConfiguratorRouter.PageType.OVERVIEW;
  initialize();
}

function ensureProductBound() {
  setRouterTestDataProductBoundAndConfigPage();
  if (mockProductConfiguration.nextOwner) {
    mockProductConfiguration.nextOwner.id = CART_ENTRY_KEY;
  }
  initialize();
}

function performUpdateOnOV() {
  ensureCartBoundAndOnOverview();
  component.onAddToCart(mockProductConfiguration, mockRouterData);
}

class MockRoutingService {
  getRouterState(): Observable<RouterState> {
    return routerStateObservable;
  }

  go = () => Promise.resolve(true);
}

class MockConfiguratorAddToCartButtonComponent {
  goToOrderDetails() {}
}

class MockActiveCartFacade implements Partial<ActiveCartFacade> {
  getActive = createSpy().and.returnValue(of(cart));
}

class MockConfiguratorStorefrontUtilsService {
  focusFirstActiveElement(): void {}
  getElement(): void {}
  changeStyling(): void {}
}

describe('ConfiguratorAddToCartButtonComponent', () => {
  let routingService: RoutingService;
  let globalMessageService: GlobalMessageService;
  let configuratorCommonsService: ConfiguratorCommonsService;
  let configuratorCartService: ConfiguratorCartService;
  let configuratorGroupsService: ConfiguratorGroupsService;
  let configuratorStorefrontUtilsService: ConfiguratorStorefrontUtilsService;
  let intersectionService: IntersectionService;
  let configuratorQuantityService: ConfiguratorQuantityService;
  let keyboardFocusService: KeyboardFocusService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [
        ConfiguratorAddToCartButtonComponent,
        MockItemCounterComponent,
        MockCxIconComponent,
        MockFeatureLevelDirective,
      ],
      providers: [
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },
        {
          provide: ConfiguratorQuantityService,
          useClass: MockConfiguratorQuantityService,
        },
        {
          provide: ConfiguratorCommonsService,
          useClass: MockConfiguratorCommonsService,
        },
        {
          provide: ConfiguratorCartService,
          useClass: MockConfiguratorCartService,
        },
        {
          provide: ConfiguratorGroupsService,
          useClass: MockConfiguratorGroupsService,
        },
        { provide: GlobalMessageService, useClass: MockGlobalMessageService },
        {
          provide: OrderHistoryFacade,
          useClass: MockOrderHistoryFacade,
        },
        {
          provide: CommonConfiguratorUtilsService,
          useClass: MockCommonConfiguratorUtilsService,
        },
        {
          provide: ConfiguratorRouterExtractorService,
          useClass: MockConfiguratorRouterExtractorService,
        },
        {
          provide: ConfiguratorAddToCartButtonComponent,
          useClass: MockConfiguratorAddToCartButtonComponent,
        },
        {
          provide: ConfiguratorStorefrontUtilsService,
          useClass: MockConfiguratorStorefrontUtilsService,
        },
        {
          provide: IntersectionService,
          useClass: MockIntersectionService,
        },
        {
          provide: MultiCartFacade,
          useClass: MockMultiCartFacade,
        },
        { provide: ActiveCartFacade, useClass: MockActiveCartFacade },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    initTestData();
    pendingChangesObservable = of(false);
    initialize();
    routingService = TestBed.inject(RoutingService);
    configuratorCommonsService = TestBed.inject(ConfiguratorCommonsService);
    globalMessageService = TestBed.inject(GlobalMessageService);
    configuratorQuantityService = TestBed.inject(ConfiguratorQuantityService);
    configuratorGroupsService = TestBed.inject(ConfiguratorGroupsService);
    configuratorStorefrontUtilsService = TestBed.inject(
      ConfiguratorStorefrontUtilsService
    );
    intersectionService = TestBed.inject(IntersectionService);
    keyboardFocusService = TestBed.inject(KeyboardFocusService);

    spyOn(configuratorGroupsService, 'setGroupStatusVisited').and.callThrough();
    spyOn(routingService, 'go').and.callThrough();
    spyOn(globalMessageService, 'add').and.callThrough();
    spyOn(configuratorCommonsService, 'removeConfiguration').and.callThrough();
    spyOn(configuratorQuantityService, 'setQuantity').and.callThrough();
    configuratorCartService = TestBed.inject(
      ConfiguratorCartService as Type<ConfiguratorCartService>
    );
    spyOn(configuratorCartService, 'getEntry').and.callThrough();
    spyOn(configuratorStorefrontUtilsService, 'changeStyling').and.stub();
    spyOn(
      configuratorStorefrontUtilsService,
      'focusFirstActiveElement'
    ).and.callThrough();
    spyOn(keyboardFocusService, 'clear').and.callThrough();
  });

  it('should create cart-btn-container', () => {
    initialize();
    expect(component).toBeTruthy();
    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      '.cx-add-to-cart-btn-container'
    );

    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      '.cx-quantity-add-to-cart-container'
    );

    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      '.cx-quantity'
    );

    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      'button.cx-add-to-cart-btn'
    );
  });

  it('should create display-only-btn-container', () => {
    setRouterTestDataReadOnlyOrder();
    initialize();
    expect(component).toBeTruthy();
    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      '.cx-display-only-btn-container'
    );

    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      'button.btn-secondary.cx-display-only-btn'
    );

    CommonConfiguratorTestUtilsService.expectElementToContainText(
      expect,
      htmlElem,
      'button.btn-secondary.cx-display-only-btn',
      'configurator.addToCart.buttonClose'
    );
  });

  it('should render button that is not disabled in case there are no pending changes', () => {
    initialize();
    const selector = htmlElem.querySelector('button');
    if (selector) {
      expect(selector.disabled).toBe(false);
    } else {
      fail();
    }
  });

  it('should not disable button in case there are pending changes', () => {
    pendingChangesObservable = of(true);
    initialize();
    const selector = htmlElem.querySelector('button');
    if (selector) {
      expect(selector.disabled).toBe(false);
    } else {
      fail();
    }
  });

  describe('ngOnInit', () => {
    it('should set quantity that was retrieved from quantity service', () => {
      initialize();
      expect(component.quantityControl.value).toBe(QUANTITY);
    });
  });

  describe('quantityChange', () => {
    it('should push current quantity to qty service', () => {
      initialize();
      component.quantityControl.setValue(QUANTITY_CHANGED);
      expect(configuratorQuantityService.setQuantity).toHaveBeenCalledWith(
        QUANTITY_CHANGED
      );
    });
  });

  describe('onAddToCart', () => {
    it('should navigate to OV in case configuration is cart bound and we are on product config page', () => {
      mockRouterData.pageType = ConfiguratorRouter.PageType.CONFIGURATION;
      performUpdateCart();
      expect(routingService.go).toHaveBeenCalledWith(
        navParamsOverview,
        queryParams
      );
      expect(
        configuratorGroupsService.setGroupStatusVisited
      ).toHaveBeenCalled();
    });

    it('should navigate to cart in case configuration is cart bound and we are on OV config page', () => {
      performUpdateOnOV();
      expect(routingService.go).toHaveBeenCalledWith('cart');
    });

    it('should not remove configuration for cart entry owner in case configuration is cart bound and we are on OV page and no changes happened', () => {
      //not needed to remove the configuration here, as clean up is done in router listener
      mockProductConfiguration.isCartEntryUpdateRequired = false;
      performUpdateOnOV();
      expect(
        configuratorCommonsService.removeConfiguration
      ).toHaveBeenCalledTimes(0);
    });

    it('should not remove configuration and display no message in case continue to cart is triggered on config page', () => {
      mockProductConfiguration.isCartEntryUpdateRequired = false;
      mockRouterData.pageType = ConfiguratorRouter.PageType.CONFIGURATION;
      performUpdateCart();
      expect(
        configuratorCommonsService.removeConfiguration
      ).toHaveBeenCalledTimes(0);
      expect(globalMessageService.add).toHaveBeenCalledTimes(0);
    });

    it('should display a message in case done is triggered on config page which means that there are pending changes', () => {
      mockProductConfiguration.isCartEntryUpdateRequired = true;
      performUpdateCart();
      expect(globalMessageService.add).toHaveBeenCalledTimes(1);
    });

    it('should display updateCart message if configuration has already been added', () => {
      ensureCartBound();
      mockProductConfiguration.isCartEntryUpdateRequired = true;
      component.onAddToCart(mockProductConfiguration, mockRouterData);
      expect(globalMessageService.add).toHaveBeenCalledTimes(1);
    });

    it('should navigate to overview in case configuration has not been added yet and we are on configuration page', () => {
      ensureProductBound();
      component.onAddToCart(mockProductConfiguration, mockRouterData);
      expect(routingService.go).toHaveBeenCalledWith(
        navParamsOverview,
        queryParams
      );
    });

    it('should remove one configuration (cart bound) in case configuration has not yet been added and we are on configuration page', () => {
      ensureProductBound();
      component.onAddToCart(mockProductConfiguration, mockRouterData);
      expect(
        configuratorCommonsService.removeConfiguration
      ).toHaveBeenCalledTimes(1);
    });

    it('should display addToCart message in case configuration has not been added yet', () => {
      ensureProductBound();
      component.onAddToCart(mockProductConfiguration, mockRouterData);
      expect(globalMessageService.add).toHaveBeenCalledTimes(1);
    });

    it('should not display addToCart message in case configuration has not been added yet but there are pending changes', () => {
      pendingChangesObservable = of(true);
      ensureProductBound();
      component.onAddToCart(mockProductConfiguration, mockRouterData);
      expect(globalMessageService.add).toHaveBeenCalledTimes(0);
    });

    it('should navigate to cart in case configuration has not yet been added and process was triggered from overview', () => {
      mockRouterData.pageType = ConfiguratorRouter.PageType.OVERVIEW;
      performAddToCartOnOverview();
      expect(routingService.go).toHaveBeenCalledWith('cart');
    });

    it('should remove one (cart bound) configurations in case configuration has not yet been added and process was triggered from overview', () => {
      //not needed to remove the configuration here, as clean up is done in router listener
      performAddToCartOnOverview();
      expect(
        configuratorCommonsService.removeConfiguration
      ).toHaveBeenCalledTimes(0);
    });
  });

  describe('navigateForProductBound', () => {
    it('should navigate to OV in case configuration is product bound and we are on product config page', () => {
      mockRouterData.pageType = ConfiguratorRouter.PageType.CONFIGURATION;
      ensureProductBound();

      component['navigateForProductBound'](
        mockProductConfiguration,
        mockOwner.configuratorType,
        false,
        mockProductConfiguration.productCode
      );
      expect(routingService.go).toHaveBeenCalledWith(
        navParamsOverview,
        queryParams
      );
    });

    it('should handle case that next owner is not defined', () => {
      mockRouterData.pageType = ConfiguratorRouter.PageType.CONFIGURATION;
      ensureProductBound();

      component['navigateForProductBound'](
        { ...mockProductConfiguration, nextOwner: undefined },
        mockOwner.configuratorType,
        false,
        mockProductConfiguration.productCode
      );
      expect(routingService.go).toHaveBeenCalledWith(
        {
          ...navParamsOverview,
          params: { ...navParamsOverview.params, entityKey: 'INITIAL' },
        },
        queryParams
      );
    });
  });

  describe('performNavigation', () => {
    it('should display message on addToCart ', () => {
      component.performNavigation(
        configuratorType,
        mockProductConfiguration.owner,
        true,
        true,
        true
      );
      expect(globalMessageService.add).toHaveBeenCalledTimes(1);
    });
    it('should display no message on addToCart in case this is not desired', () => {
      component.performNavigation(
        configuratorType,
        mockProductConfiguration.owner,
        true,
        true,
        false
      );
      expect(globalMessageService.add).toHaveBeenCalledTimes(0);
    });
  });

  describe('leaveConfigurationOverview', () => {
    it('should navigate to order details', () => {
      setRouterTestDataReadOnlyOrder();
      initialize();
      component.leaveConfigurationOverview();
      expect(routingService.go).toHaveBeenCalledWith({
        cxRoute: 'orderDetails',
        params: mockOrder,
      });
    });

    it('should navigate to quote details in case owner is quote entry', () => {
      setRouterTestDataReadOnlySavedCart();
      initialize();
      component.leaveConfigurationOverview();
      expect(routingService.go).toHaveBeenCalledWith({
        cxRoute: 'quoteDetails',
        params: { quoteId: QUOTE_CODE },
      });
    });

    it('should navigate to quote details in case owner is saved cart entry and saved cart is bound to a quote', () => {
      setRouterTestDataReadOnlyQuote();
      initialize();
      component.leaveConfigurationOverview();
      expect(routingService.go).toHaveBeenCalledWith({
        cxRoute: 'quoteDetails',
        params: { quoteId: QUOTE_CODE },
      });
    });

    it('should navigate to product details', () => {
      setRouterTestDataReadOnlyProduct();
      initialize();
      component.leaveConfigurationOverview();
      expect(routingService.go).toHaveBeenCalledWith({
        cxRoute: 'product',
        params: {
          code: PRODUCT_ENTRY_KEY,
        },
      });
    });

    it('should navigate to cart', () => {
      setRouterTestDataReadOnlyCart();
      initialize();
      component.leaveConfigurationOverview();
      expect(routingService.go).toHaveBeenCalledWith({
        cxRoute: 'cart',
      });
    });

    it('should navigate to checkout review order', () => {
      setRouterTestDataReadOnlyCheckout();
      initialize();
      component.leaveConfigurationOverview();
      expect(routingService.go).toHaveBeenCalledWith({
        cxRoute: 'checkoutReviewOrder',
      });
    });
  });

  describe('Floating button', () => {
    it('should make button sticky', (done) => {
      spyOn(configuratorStorefrontUtilsService, 'getElement').and.returnValue(
        elementMock as unknown as HTMLElement
      );
      spyOn(intersectionService, 'isIntersecting').and.returnValue(of(true));
      component.ngOnInit();
      component.container$.pipe(take(1), delay(0)).subscribe(() => {
        expect(
          configuratorStorefrontUtilsService.changeStyling
        ).toHaveBeenCalledWith(
          'cx-configurator-add-to-cart-button',
          'position',
          'sticky'
        );
        done();
      });
    });

    it('should make button fixed when not intersecting', (done) => {
      spyOn(configuratorStorefrontUtilsService, 'getElement').and.returnValue(
        elementMock as unknown as HTMLElement
      );
      component.ngOnInit();
      component.container$.pipe(take(1), delay(0)).subscribe(() => {
        spyOn(intersectionService, 'isIntersecting').and.callThrough();
        expect(
          configuratorStorefrontUtilsService.changeStyling
        ).toHaveBeenCalledWith(
          'cx-configurator-add-to-cart-button',
          'position',
          'fixed'
        );
        done();
      });
    });
  });

  describe('Accessibility', () => {
    it('should return base price, selected option price and total price', () => {
      let result = {
        basePrice: '$123.56',
        selectedOptions: '$500',
        totalPrice: '$623.56',
      };
      expect(component.extractConfigPrices(mockProductConfiguration)).toEqual(
        result
      );
    });

    it('should return "0" in case there is no price summary in the configuration', () => {
      let result = {
        basePrice: '0',
        selectedOptions: '0',
        totalPrice: '0',
      };
      expect(
        component.extractConfigPrices(
          mockProductConfigurationWithoutPriceSummary
        )
      ).toEqual(result);
    });

    it('should return "0" for basePrice in case basePrice is undefined', () => {
      let result = {
        basePrice: '0',
        selectedOptions: '$500',
        totalPrice: '$623.56',
      };
      expect(
        component.extractConfigPrices(mockProductConfigurationWithoutBasePrice)
      ).toEqual(result);
    });

    it('should return "0" for basePrice in case basePrice is undefined', () => {
      let result = {
        basePrice: '0',
        selectedOptions: '$500',
        totalPrice: '$623.56',
      };
      expect(
        component.extractConfigPrices(mockProductConfigurationWithoutBasePrice)
      ).toEqual(result);
    });

    it('should return "0" for selectedOption in case selectedOption is undefined', () => {
      let result = {
        basePrice: '$123.56',
        selectedOptions: '0',
        totalPrice: '$623.56',
      };
      expect(
        component.extractConfigPrices(
          mockProductConfigurationWithoutSelectedOptions
        )
      ).toEqual(result);
    });

    it('should return "0" for totalPrice in case totalPrice  is undefined', () => {
      let result = {
        basePrice: '$123.56',
        selectedOptions: '$500',
        totalPrice: '0',
      };
      expect(
        component.extractConfigPrices(mockProductConfigurationWithoutTotalPrice)
      ).toEqual(result);
    });

    it('should return "0" for prices in case they are not available', () => {
      let result = {
        basePrice: '0',
        selectedOptions: '0',
        totalPrice: '0',
      };
      expect(
        component.extractConfigPrices(
          mockProductConfigurationWithPriceSummaryButNoPrices
        )
      ).toEqual(result);
    });

    it('should contain add to cart button element with `aria-label` attribute that contains prices of the configuration', () => {
      let basePrice =
        mockProductConfiguration.priceSummary?.basePrice?.formattedValue;
      let selectedOptions =
        mockProductConfiguration.priceSummary?.selectedOptions?.formattedValue;
      let totalPrice =
        mockProductConfiguration.priceSummary?.currentTotal?.formattedValue;
      let expectedA11YString =
        `configurator.a11y.addToCartPrices basePrice:${basePrice}` +
        ` selectedOptions:${selectedOptions} totalPrice:${totalPrice}`;
      CommonConfiguratorTestUtilsService.expectElementContainsA11y(
        expect,
        htmlElem,
        'button',
        undefined,
        0,
        'aria-label',
        component.getButtonResourceKey(
          mockRouterData,
          mockProductConfiguration
        ) +
          ' ' +
          expectedA11YString
      );
    });
  });

  describe('getButtonResourceKey', () => {
    let routerData: ConfiguratorRouter.Data;
    let config: Configurator.Configuration;

    function prepareTestData(
      isOwnerCartEntry: boolean,
      isCartEntryUpdateRequired: boolean
    ) {
      routerData = {
        pageType: ConfiguratorRouter.PageType.CONFIGURATION,
        isOwnerCartEntry: isOwnerCartEntry,
        owner: mockOwner,
      };

      config = structuredClone(mockProductConfiguration);
      config.isCartEntryUpdateRequired = isCartEntryUpdateRequired;
    }

    it('should return `configurator.addToCart.buttonUpdateCart` for cart', () => {
      prepareTestData(true, true);
      expect(component.getButtonResourceKey(routerData, config)).toBe(
        'configurator.addToCart.buttonUpdateCart'
      );
    });

    it('should return `configurator.addToCart.buttonUpdateCart` for quote', () => {
      prepareTestData(true, true);
      expect(component.getButtonResourceKey(routerData, config, true)).toBe(
        'configurator.addToCart.buttonUpdateCart'
      );
    });

    it('should return `configurator.addToCart.buttonAfterAddToCart`', () => {
      prepareTestData(true, false);
      expect(component.getButtonResourceKey(routerData, config)).toBe(
        'configurator.addToCart.buttonAfterAddToCart'
      );
    });

    it('should return `configurator.addToCart.buttonForQuote` for quote', () => {
      prepareTestData(true, false);
      expect(component.getButtonResourceKey(routerData, config, true)).toBe(
        'configurator.addToCart.buttonForQuote'
      );
    });

    it('should return `configurator.addToCart.button`', () => {
      prepareTestData(false, false);

      expect(component.getButtonResourceKey(routerData, config)).toBe(
        'configurator.addToCart.button'
      );
    });
  });

  describe('isCartEntry', () => {
    it('should return `false` because isOwnerCartEntry is undefined', () => {
      const routerData: ConfiguratorRouter.Data = {
        pageType: ConfiguratorRouter.PageType.CONFIGURATION,
        owner: mockOwner,
      };

      expect(component.isCartEntry(routerData)).toBe(false);
    });

    it('should return `false` because it is not a cart entry', () => {
      const routerData: ConfiguratorRouter.Data = {
        pageType: ConfiguratorRouter.PageType.CONFIGURATION,
        owner: mockOwner,
        isOwnerCartEntry: false,
      };

      expect(component.isCartEntry(routerData)).toBe(false);
    });

    it('should return `true` because it is a cart entry', () => {
      const routerData: ConfiguratorRouter.Data = {
        pageType: ConfiguratorRouter.PageType.OVERVIEW,
        owner: mockOwner,
        isOwnerCartEntry: true,
      };

      expect(component.isCartEntry(routerData)).toBe(true);
    });
  });

  describe('Focus handling on navigation', () => {
    it('focusOverviewInTabBar should call clear and focusFirstActiveElement', fakeAsync(() => {
      component['focusOverviewInTabBar']();
      tick(1); // needed because of delay(0) in focusOverviewInTabBar
      expect(keyboardFocusService.clear).toHaveBeenCalledTimes(1);
      expect(
        configuratorStorefrontUtilsService.focusFirstActiveElement
      ).toHaveBeenCalledTimes(1);
    }));

    it('focusOverviewInTabBar should not call clear and focusFirstActiveElement if overview data is not present in configuration', fakeAsync(() => {
      spyOn(configuratorCommonsService, 'getConfiguration').and.returnValue(
        of(mockProductConfigurationWithoutBasePrice)
      );
      component['focusOverviewInTabBar']();
      tick(1); // needed because of delay(0) in focusOverviewInTabBar
      expect(keyboardFocusService.clear).toHaveBeenCalledTimes(0);
      expect(
        configuratorStorefrontUtilsService.focusFirstActiveElement
      ).toHaveBeenCalledTimes(0);
    }));

    it('navigateToOverview should navigate to overview page and should call focusFirstActiveElement inside focusOverviewInTabBar', fakeAsync(() => {
      component['navigateToOverview'](
        mockRouterData.owner.configuratorType,
        mockRouterData.owner,
        mockProductConfiguration.productCode
      );
      tick(1); // needed because of delay(0) in focusOverviewInTabBar
      expect(routingService.go).toHaveBeenCalledWith(
        {
          cxRoute: 'configureOverview' + mockRouterData.owner.configuratorType,
          params: {
            ownerType: 'cartEntry',
            entityKey: mockRouterData.owner.id,
          },
        },
        queryParams
      );
      expect(
        configuratorStorefrontUtilsService.focusFirstActiveElement
      ).toHaveBeenCalledTimes(1);
    }));
  });

  describe('isQuoteCartActive', () => {
    cart.quoteCode = QUOTE_CODE;
    it('should return `true` in case quote cart is active', () => {
      component['isQuoteCartActive']()
        .subscribe((isQuoteCartActive) => {
          expect(isQuoteCartActive).toBe(true);
        })
        .unsubscribe();
    });

    it('should return `false` in case quote cart is not active', () => {
      cart.quoteCode = undefined;
      component['isQuoteCartActive']()
        .subscribe((isQuoteCartActive) => {
          expect(isQuoteCartActive).toBe(false);
        })
        .unsubscribe();
    });
  });

  describe('getTranslationKey', () => {
    it('should return `configurator.addToCart.confirmationQuoteUpdate` in case quote cart is active', () => {
      component['getTranslationKeyForAddToCart'](true)
        .subscribe((translationKey) => {
          expect(translationKey).toBe(
            'configurator.addToCart.confirmationQuoteUpdate'
          );
        })
        .unsubscribe();
    });

    it('should return `configurator.addToCart.confirmation` in case `isAddToCart` is true', () => {
      cart.quoteCode = undefined;
      component['getTranslationKeyForAddToCart'](true)
        .subscribe((translationKey) => {
          expect(translationKey).toBe('configurator.addToCart.confirmation');
        })
        .unsubscribe();
    });

    it('should return `configurator.addToCart.confirmationUpdate` in case `isAddToCart` is false', () => {
      cart.quoteCode = undefined;
      component['getTranslationKeyForAddToCart'](false)
        .subscribe((translationKey) => {
          expect(translationKey).toBe(
            'configurator.addToCart.confirmationUpdate'
          );
        })
        .unsubscribe();
    });
  });
});
