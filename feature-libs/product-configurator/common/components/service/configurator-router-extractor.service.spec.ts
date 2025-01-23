import { Type } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import {
  I18nTestingModule,
  RouterState,
  RoutingService,
} from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { CommonConfigurator } from '../../core/model/common-configurator.model';
import { ConfiguratorType } from './../../core/model/common-configurator.model';
import { ConfiguratorRouter } from './configurator-router-data';
import { ConfiguratorRouterExtractorService } from './configurator-router-extractor.service';

const PRODUCT_CODE = 'CONF_LAPTOP';
const CART_ENTRY_NUMBER = '0';
const CONFIGURATOR_TYPE = ConfiguratorType.VARIANT;
const CONFIGURATOR_ROUTE = 'configureCPQCONFIGURATOR';
const OVERVIEW_ROUTE = 'configureOverviewCPQCONFIGURATOR';
const CONFIG_ID_TEMPLATE = 'abcd';

let mockRouterState: any;

class MockRoutingService {
  getRouterState(): Observable<RouterState> {
    return of(mockRouterState);
  }
}

describe('ConfigRouterExtractorService', () => {
  let serviceUnderTest: ConfiguratorRouterExtractorService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      providers: [
        {
          provide: RoutingService,
          useClass: MockRoutingService,
        },
      ],
    }).compileComponents();
  }));
  beforeEach(() => {
    serviceUnderTest = TestBed.inject(
      ConfiguratorRouterExtractorService as Type<ConfiguratorRouterExtractorService>
    );

    mockRouterState = {
      state: {
        params: {
          entityKey: PRODUCT_CODE,
          ownerType: CommonConfigurator.OwnerType.PRODUCT,
        },
        queryParams: {},
        semanticRoute: CONFIGURATOR_ROUTE,
      },
    };
  });

  it('should create component', () => {
    expect(serviceUnderTest).toBeDefined();
  });

  describe('extractRouterData', () => {
    it('should find proper owner for route based purely on product code', () => {
      let owner: CommonConfigurator.Owner;
      serviceUnderTest.extractRouterData().subscribe((routerData) => {
        owner = routerData.owner;
        expect(owner.id).toBe(PRODUCT_CODE);
        expect(owner.type).toBe(CommonConfigurator.OwnerType.PRODUCT);
        expect(owner.key.includes(CommonConfigurator.OwnerType.PRODUCT)).toBe(
          true
        );
      });
    });

    it('should find proper owner for route based on owner type PRODUCT and product code', () => {
      let owner: CommonConfigurator.Owner;
      mockRouterState.state.params.ownerType =
        CommonConfigurator.OwnerType.PRODUCT;
      mockRouterState.state.params.entityKey = PRODUCT_CODE;

      serviceUnderTest.extractRouterData().subscribe((routerData) => {
        owner = routerData.owner;
        expect(owner.id).toBe(PRODUCT_CODE);
        expect(owner.type).toBe(CommonConfigurator.OwnerType.PRODUCT);
        expect(owner.key.includes(CommonConfigurator.OwnerType.PRODUCT)).toBe(
          true
        );
      });
    });

    it('should find proper owner for route based on owner type CART_ENTRY and cart entry number', () => {
      let owner: CommonConfigurator.Owner;
      mockRouterState.state.params.ownerType =
        CommonConfigurator.OwnerType.CART_ENTRY;
      mockRouterState.state.params.entityKey = CART_ENTRY_NUMBER;

      serviceUnderTest.extractRouterData().subscribe((routerData) => {
        owner = routerData.owner;
        expect(owner.id).toBe(CART_ENTRY_NUMBER);
        expect(owner.type).toBe(CommonConfigurator.OwnerType.CART_ENTRY);
        expect(
          owner.key.includes(CommonConfigurator.OwnerType.CART_ENTRY)
        ).toBe(true);
      });
    });

    it('should determine configurator and page type from router state ', () => {
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest.extractRouterData().subscribe((data) => {
        routerData = data;
        expect(routerData.owner.configuratorType).toBe(CONFIGURATOR_TYPE);
        expect(routerData.isOwnerCartEntry).toBe(false);
        expect(routerData.pageType).toBe(
          ConfiguratorRouter.PageType.CONFIGURATION
        );
      });
    });

    it('should determine configurator and page type from router based on owner type CART_ENTRY and cart entry number ', () => {
      mockRouterState.state.params.ownerType =
        CommonConfigurator.OwnerType.CART_ENTRY;
      mockRouterState.state.params.entityKey = CART_ENTRY_NUMBER;
      mockRouterState.state.semanticRoute = OVERVIEW_ROUTE;
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest
        .extractRouterData()
        .subscribe((data) => {
          routerData = data;
          expect(routerData.owner.configuratorType).toBe(CONFIGURATOR_TYPE);
          expect(routerData.isOwnerCartEntry).toBe(true);
          expect(routerData.pageType).toBe(
            ConfiguratorRouter.PageType.OVERVIEW
          );
          expect(routerData.forceReload).toBe(false);
        })
        .unsubscribe();
    });

    it('should map the navigationId', () => {
      mockRouterState.navigationId = 3;
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest
        .extractRouterData()
        .subscribe((data) => {
          routerData = data;
          expect(routerData.navigationId).toBe(3);
        })
        .unsubscribe();
    });

    it('should tell from the URL if we need to enforce a reload of a configuration', () => {
      mockRouterState.state.queryParams = { forceReload: 'true' };
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest
        .extractRouterData()
        .subscribe((data) => {
          routerData = data;
          expect(routerData.forceReload).toBe(true);
        })
        .unsubscribe();
    });

    it('should tell from the URL if we need to resolve issues without ignoring conflicts of a configuration', (done) => {
      mockRouterState.state.queryParams = { resolveIssues: 'true' };
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest
        .extractRouterData()
        .subscribe((data) => {
          routerData = data;
          expect(routerData.resolveIssues).toBe(true);
          expect(routerData.skipConflicts).toBe(false);
          done();
        })
        .unsubscribe();
    });

    it('should tell from the URL if we need to skip conflicts while resolving issues of a configuration', (done) => {
      mockRouterState.state.queryParams = {
        resolveIssues: 'true',
        skipConflicts: 'true',
      };
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest
        .extractRouterData()
        .subscribe((data) => {
          routerData = data;
          expect(routerData.resolveIssues).toBe(true);
          expect(routerData.skipConflicts).toBe(true);
          done();
        })
        .unsubscribe();
    });

    it('should check whether an expert was set via query parameter', () => {
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest
        .extractRouterData()
        .subscribe((data) => {
          routerData = data;
          expect(routerData.expMode).toBe(false);
        })
        .unsubscribe();
    });

    it('should tell from the URL if we need to fetch a configuration for an expert mode', () => {
      mockRouterState.state.queryParams = { expMode: 'true' };
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest
        .extractRouterData()
        .subscribe((data) => {
          routerData = data;
          expect(routerData.expMode).toBe(true);
        })
        .unsubscribe();
    });

    it('should tell from the URL if we do not need to fetch a configuration for an expert mode', () => {
      mockRouterState.state.queryParams = { expMode: 'false' };
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest
        .extractRouterData()
        .subscribe((data) => {
          routerData = data;
          expect(routerData.expMode).toBe(false);
        })
        .unsubscribe();
    });

    it('should tell from the URL that a configuration template ID has been passed', () => {
      mockRouterState.state.queryParams = {
        configIdTemplate: CONFIG_ID_TEMPLATE,
      };
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest
        .extractRouterData()
        .subscribe((data) => {
          routerData = data;
          expect(routerData.configIdTemplate).toBe(CONFIG_ID_TEMPLATE);
        })
        .unsubscribe();
    });

    it('should be fine with configuration template ID not provided', () => {
      mockRouterState.state.queryParams = {};
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest
        .extractRouterData()
        .subscribe((data) => {
          routerData = data;
          expect(routerData.configIdTemplate).toBe(undefined);
        })
        .unsubscribe();
    });

    it('should set displayRestartDialog to true if requested via query parameter', () => {
      mockRouterState.state.queryParams = {
        displayRestartDialog: 'true',
      };
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest
        .extractRouterData()
        .subscribe((data) => {
          routerData = data;
          expect(routerData.displayRestartDialog).toBe(true);
        })
        .unsubscribe();
    });

    it('should set displayRestartDialog to false if the corresponding query parameter is missing', () => {
      mockRouterState.state.queryParams = {};
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest
        .extractRouterData()
        .subscribe((data) => {
          routerData = data;
          expect(routerData.displayRestartDialog).toBe(false);
        })
        .unsubscribe();
    });

    it('should check whether navigateToCheckout was set via query parameter', () => {
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest
        .extractRouterData()
        .subscribe((data) => {
          routerData = data;
          expect(routerData.navigateToCheckout).toBe(false);
        })
        .unsubscribe();
    });

    it('should tell from the URL if the navigation to the checkout is relevant', () => {
      mockRouterState.state.queryParams = { navigateToCheckout: 'true' };
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest
        .extractRouterData()
        .subscribe((data) => {
          routerData = data;
          expect(routerData.navigateToCheckout).toBe(true);
        })
        .unsubscribe();
    });

    it('should tell from the URL if the navigation to the checkout is not relevant', () => {
      mockRouterState.state.queryParams = { navigateToCheckout: 'false' };
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest
        .extractRouterData()
        .subscribe((data) => {
          routerData = data;
          expect(routerData.navigateToCheckout).toBe(false);
        })
        .unsubscribe();
    });

    it('should tell from the URL that a product code has been passed', () => {
      mockRouterState.state.queryParams = {
        productCode: PRODUCT_CODE,
      };
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest
        .extractRouterData()
        .subscribe((data) => {
          routerData = data;
          expect(routerData.productCode).toBe(PRODUCT_CODE);
        })
        .unsubscribe();
    });

    it('should be fine with a product code not provided', () => {
      mockRouterState.state.queryParams = {};
      let routerData: ConfiguratorRouter.Data;
      serviceUnderTest
        .extractRouterData()
        .subscribe((data) => {
          routerData = data;
          expect(routerData.productCode).toBe(undefined);
        })
        .unsubscribe();
    });
  });

  describe('createOwnerFromRouterState', () => {
    it('should create owner from router state correctly', () => {
      const owner: CommonConfigurator.Owner =
        serviceUnderTest.createOwnerFromRouterState(mockRouterState);

      expect(owner.type).toBe(CommonConfigurator.OwnerType.PRODUCT);
    });

    it('should create owner from router state if owner type is not provided', () => {
      mockRouterState.state.params = {
        rootProduct: PRODUCT_CODE,
      };
      const owner: CommonConfigurator.Owner =
        serviceUnderTest.createOwnerFromRouterState(mockRouterState);

      expect(owner.type).toBe(CommonConfigurator.OwnerType.PRODUCT);
    });

    it('should detect an obsolete state of a cart related owner type', () => {
      mockRouterState.state.params.ownerType =
        CommonConfigurator.OwnerType.CART_ENTRY;
      mockRouterState.state.params.entityKey = CART_ENTRY_NUMBER;

      const owner: CommonConfigurator.Owner =
        serviceUnderTest.createOwnerFromRouterState(mockRouterState);

      expect(owner.type).toBe(CommonConfigurator.OwnerType.CART_ENTRY);
    });
  });

  describe('getConfiguratorTypeFromSemanticRoute', () => {
    it('should throw error if semantic route is empty', () => {
      expect(() =>
        serviceUnderTest['getConfiguratorTypeFromSemanticRoute']('')
      ).toThrowError();
    });

    it('should throw error if semantic route is not configuration neither OV page', () => {
      expect(() =>
        serviceUnderTest['getConfiguratorTypeFromSemanticRoute'](
          'isNoKnownRoute'
        )
      ).toThrowError();
    });
  });
});
