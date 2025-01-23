import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CartModification } from '@spartacus/cart/base/root';
import {
  CommonConfigurator,
  CommonConfiguratorUtilsService,
  ConfiguratorModelUtils,
  ConfiguratorType,
} from '@spartacus/product-configurator/common';
import { of } from 'rxjs';
import { ConfiguratorTestUtils } from '../../testing/configurator-test-utils';
import { ConfiguratorCoreConfig } from '../config/configurator-core.config';
import { Configurator } from '../model/configurator.model';
import { RulebasedConfiguratorAdapter } from './rulebased-configurator.adapter';
import { RulebasedConfiguratorConnector } from './rulebased-configurator.connector';

import createSpy = jasmine.createSpy;

const PRODUCT_CODE = 'CONF_LAPTOP';
const CONFIG_ID = '1234-56-7890';
const CONFIG_ID_TEMPLATE = '1234-56-aaab';
const USER_ID = 'theUser';
const CART_ID = '98876';
const CONFIGURATOR_TYPE = 'configuratortype';

const productConfiguration: Configurator.Configuration = {
  ...ConfiguratorTestUtils.createConfiguration(
    CONFIG_ID,
    ConfiguratorModelUtils.createOwner(
      CommonConfigurator.OwnerType.PRODUCT,
      PRODUCT_CODE,
      CONFIGURATOR_TYPE
    )
  ),
  productCode: PRODUCT_CODE,
};

const readFromCartEntryParameters: CommonConfigurator.ReadConfigurationFromCartEntryParameters =
  {
    userId: USER_ID,
    cartId: CART_ID,
    owner: productConfiguration.owner,
  };

const readFromOrderEntryParameters: CommonConfigurator.ReadConfigurationFromOrderEntryParameters =
  {
    userId: USER_ID,
    orderId: CART_ID,
    owner: productConfiguration.owner,
  };

const updateFromCartEntryParameters: Configurator.UpdateConfigurationForCartEntryParameters =
  {
    userId: USER_ID,
    cartId: CART_ID,
    configuration: productConfiguration,
    cartEntryNumber: '0',
  };

const cartModification: CartModification = {};

class MockRulebasedConfiguratorAdapter implements RulebasedConfiguratorAdapter {
  public configuratorType: string;

  readConfigurationForCartEntry = createSpy().and.callFake(() =>
    of(productConfiguration)
  );
  readConfigurationForOrderEntry = createSpy().and.callFake(() =>
    of(productConfiguration)
  );
  updateConfigurationForCartEntry = createSpy().and.callFake(() =>
    of(cartModification)
  );
  getConfigurationOverview = createSpy().and.callFake((configId: string) =>
    of('getConfigurationOverview' + configId)
  );

  searchVariants = createSpy().and.callFake((configId: string) =>
    of([{ productCode: PRODUCT_CODE + configId }])
  );

  readPriceSummary = createSpy().and.callFake((configId: string) =>
    of('readPriceSummary' + configId)
  );

  readConfiguration = createSpy().and.callFake((configId: string) =>
    of('readConfiguration' + configId)
  );

  updateConfiguration = createSpy().and.callFake(
    (configuration: Configurator.Configuration) =>
      of('updateConfiguration' + configuration.configId)
  );

  updateConfigurationOverview = createSpy().and.callFake(
    (ovInput: Configurator.Overview) =>
      of('updateConfigurationOverview' + ovInput.configId)
  );

  createConfiguration = createSpy().and.callFake(
    (owner: CommonConfigurator.Owner) => of('createConfiguration' + owner)
  );

  addToCart = createSpy().and.callFake((configId: string) =>
    of('addToCart' + configId)
  );
  getConfiguratorType(): string {
    return this.configuratorType ?? CONFIGURATOR_TYPE;
  }
}

describe('RulebasedConfiguratorConnector', () => {
  let service: RulebasedConfiguratorConnector;
  let configuratorUtils: CommonConfiguratorUtilsService;
  let adapter: RulebasedConfiguratorAdapter[];

  const GROUP_ID = 'GROUP1';

  const QUANTITY = 1;

  const MockConfig: ConfiguratorCoreConfig = {
    productConfigurator: {},
  };

  function createMockAdapter(
    configuratorType?: string
  ): RulebasedConfiguratorAdapter {
    let adapter = new MockRulebasedConfiguratorAdapter();
    adapter.configuratorType = configuratorType ?? CONFIGURATOR_TYPE;
    return adapter;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: RulebasedConfiguratorConnector.CONFIGURATOR_ADAPTER_LIST,
          useClass: MockRulebasedConfiguratorAdapter,
          multi: true,
        },
        {
          provide: ConfiguratorCoreConfig,
          useValue: MockConfig,
        },
        {
          provide: RulebasedConfiguratorConnector,
          useClass: RulebasedConfiguratorConnector,
        },
      ],
    });
    service = TestBed.inject(
      RulebasedConfiguratorConnector as Type<RulebasedConfiguratorConnector>
    );
    configuratorUtils = TestBed.inject(
      CommonConfiguratorUtilsService as Type<CommonConfiguratorUtilsService>
    );
    adapter = TestBed.inject(
      RulebasedConfiguratorConnector.CONFIGURATOR_ADAPTER_LIST
    );

    configuratorUtils.setOwnerKey(productConfiguration.owner);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createConfiguration', () => {
    it('should call adapter', () => {
      let result;
      service
        .createConfiguration(productConfiguration.owner)
        .subscribe((res) => (result = res));
      expect(result).toBe('createConfiguration' + productConfiguration.owner);

      expect(adapter[0].createConfiguration).toHaveBeenCalledWith(
        productConfiguration.owner,
        undefined,
        false
      );
    });

    it('should forward configuration template ID', () => {
      service
        .createConfiguration(productConfiguration.owner, CONFIG_ID_TEMPLATE)
        .subscribe();

      expect(adapter[0].createConfiguration).toHaveBeenCalledWith(
        productConfiguration.owner,
        CONFIG_ID_TEMPLATE,
        false
      );
    });

    it('should forward forceReset flag', () => {
      service
        .createConfiguration(
          productConfiguration.owner,
          CONFIG_ID_TEMPLATE,
          true
        )
        .subscribe();

      expect(adapter[0].createConfiguration).toHaveBeenCalledWith(
        productConfiguration.owner,
        CONFIG_ID_TEMPLATE,
        true
      );
    });

    it('should throw an error in case no adapter present for configurator type', () => {
      expect(function () {
        const ownerForUnknownConfigurator = ConfiguratorModelUtils.createOwner(
          CommonConfigurator.OwnerType.PRODUCT,
          PRODUCT_CODE,
          'unknown'
        );
        service.createConfiguration(ownerForUnknownConfigurator);
      }).toThrow();
    });

    it('should not throw an error in case an adapter is present for owners configurator type', () => {
      expect(function () {
        const ownerForUnknownConfigurator = ConfiguratorModelUtils.createOwner(
          CommonConfigurator.OwnerType.PRODUCT,
          PRODUCT_CODE,
          CONFIGURATOR_TYPE
        );
        service.createConfiguration(ownerForUnknownConfigurator);
      }).toBeDefined();
    });
  });

  it('should call adapter on readConfigurationForCartEntry', () => {
    service
      .readConfigurationForCartEntry(readFromCartEntryParameters)
      .subscribe((configuration) =>
        expect(configuration).toBe(productConfiguration)
      );
    expect(adapter[0].readConfigurationForCartEntry).toHaveBeenCalledWith(
      readFromCartEntryParameters
    );
  });

  it('should call adapter on updateConfigurationForCartEntry', () => {
    service
      .updateConfigurationForCartEntry(updateFromCartEntryParameters)
      .subscribe((result) => expect(result).toBe(cartModification));
    expect(adapter[0].updateConfigurationForCartEntry).toHaveBeenCalledWith(
      updateFromCartEntryParameters
    );
  });

  it('should call adapter on readConfigurationForOrderEntry', () => {
    service
      .readConfigurationForOrderEntry(readFromOrderEntryParameters)
      .subscribe((configuration) =>
        expect(configuration).toBe(productConfiguration)
      );
    expect(adapter[0].readConfigurationForOrderEntry).toHaveBeenCalledWith(
      readFromOrderEntryParameters
    );
  });

  it('should call adapter on readConfiguration', () => {
    let result;
    service
      .readConfiguration(CONFIG_ID, GROUP_ID, productConfiguration.owner)
      .subscribe((res) => (result = res));
    expect(result).toBe('readConfiguration' + CONFIG_ID);
    expect(adapter[0].readConfiguration).toHaveBeenCalledWith(
      CONFIG_ID,
      GROUP_ID,
      productConfiguration.owner
    );
  });

  it('should call adapter on updateConfiguration', () => {
    let result;
    service
      .updateConfiguration(productConfiguration)
      .subscribe((res) => (result = res));
    expect(result).toBe('updateConfiguration' + CONFIG_ID);
    expect(adapter[0].updateConfiguration).toHaveBeenCalledWith(
      productConfiguration
    );
  });

  it('should call adapter on readConfigurationPrice', () => {
    let result;
    service
      .readPriceSummary(productConfiguration)
      .subscribe((res) => (result = res));
    expect(result).toBe('readPriceSummary' + productConfiguration);
    expect(adapter[0].readPriceSummary).toHaveBeenCalledWith(
      productConfiguration
    );
  });

  it('should call adapter on getConfigurationOverview', () => {
    let result;
    service
      .getConfigurationOverview(productConfiguration)
      .subscribe((res) => (result = res));
    expect(result).toBe(
      'getConfigurationOverview' + productConfiguration.configId
    );
    expect(adapter[0].getConfigurationOverview).toHaveBeenCalledWith(
      productConfiguration.configId
    );
  });

  it('should call adapter on searchVariants', () => {
    let result;
    service
      .searchVariants(productConfiguration)
      .subscribe((res) => (result = res));
    expect(result).toEqual([
      { productCode: PRODUCT_CODE + productConfiguration.configId },
    ]);
    expect(adapter[0].searchVariants).toHaveBeenCalledWith(
      productConfiguration.configId
    );
  });

  it('should call adapter on addToCart', () => {
    const parameters: Configurator.AddToCartParameters = {
      userId: USER_ID,
      cartId: CART_ID,
      productCode: PRODUCT_CODE,
      quantity: QUANTITY,
      configId: CONFIG_ID,
      owner: productConfiguration.owner,
    };
    let result;
    service.addToCart(parameters).subscribe((res) => (result = res));
    expect(adapter[0].addToCart).toHaveBeenCalledWith(parameters);
    expect(result).toBe('addToCart' + parameters);
  });

  describe('updateConfigurationOverview', () => {
    it('should forward to adapter', () => {
      const overview: Configurator.Overview = {
        configId: productConfiguration.configId,
        productCode: productConfiguration.productCode,
      };
      const configWithOverview: Configurator.Configuration = {
        ...productConfiguration,
        overview: overview,
      };
      let result;
      service
        .updateConfigurationOverview(configWithOverview)
        .subscribe((res) => (result = res));
      expect(adapter[0].updateConfigurationOverview).toHaveBeenCalledWith(
        overview
      );
      expect(result).toBe(
        'updateConfigurationOverview' + productConfiguration.configId
      );
    });
    it('should retrieve overview if not available (exception case)', () => {
      let result;
      service
        .updateConfigurationOverview(productConfiguration)
        .subscribe((res) => (result = res));
      expect(adapter[0].getConfigurationOverview).toHaveBeenCalledWith(
        productConfiguration.configId
      );
      expect(result).toBe(
        'getConfigurationOverview' + productConfiguration.configId
      );
    });
  });

  describe('isAdapterMatching', () => {
    function isAdapterMatching(
      adapter: RulebasedConfiguratorAdapter,
      configuratorType: string
    ): boolean {
      // we use call here to avoid losing 'this'-context
      return service['isAdapterMatching'].call(
        service,
        adapter,
        configuratorType
      );
    }

    it('should match if configurator types are the same', () => {
      const adapter = createMockAdapter(ConfiguratorType.VARIANT);
      expect(isAdapterMatching(adapter, ConfiguratorType.VARIANT)).toBe(true);
    });

    it("shouldn't match if configurator types aren't the same", () => {
      const adapter = createMockAdapter(ConfiguratorType.VARIANT);
      expect(isAdapterMatching(adapter, ConfiguratorType.CPQ)).toBe(false);
    });
  });
});
