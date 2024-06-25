import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConverterService, FeatureConfigService } from '@spartacus/core';
import { Configurator } from '@spartacus/product-configurator/rulebased';
import { OccConfiguratorTestUtils } from '../../../testing/occ-configurator-test-utils';
import { OccConfigurator } from '../variant-configurator-occ.models';
import { OccConfiguratorVariantPriceNormalizer } from './occ-configurator-variant-price-normalizer';

const emptySource: OccConfigurator.Prices = {
  configId: 'configId',
};

class MockConverterService {
  convert() {}
}

let productConfigurationDeltaRenderingEnabled = false;
class MockFeatureConfigService {
  isEnabled(name: string): boolean {
    if (name === 'productConfigurationDeltaRendering') {
      return productConfigurationDeltaRenderingEnabled;
    }
    return false;
  }
}

describe('OccConfiguratorVariantPriceNormalizer', () => {
  let classUnderTest: OccConfiguratorVariantPriceNormalizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OccConfiguratorVariantPriceNormalizer,
        { provide: ConverterService, useClass: MockConverterService },
        { provide: FeatureConfigService, useClass: MockFeatureConfigService },
      ],
    });

    classUnderTest = TestBed.inject(
      OccConfiguratorVariantPriceNormalizer as Type<OccConfiguratorVariantPriceNormalizer>
    );
  });

  it('should be created', () => {
    expect(classUnderTest).toBeTruthy();
  });

  describe('convertValueSupplement', () => {
    it('should return a list with one value supplements', () => {
      const source = OccConfiguratorTestUtils.createValueSupplements(
        'value_01',
        '100.00 €',
        100
      );
      const result: Configurator.ValueSupplement[] = [];
      classUnderTest.convertValueSupplement(source, result);
      expect(result?.length).toBe(1);
      expect(result[0].attributeValueKey).toEqual(source.attributeValueKey);
      expect(result[0].priceValue.formattedValue).toEqual(
        source.priceValue.formattedValue
      );
      expect(result[0].priceValue.value).toEqual(source.priceValue.value);
      expect(result[0].obsoletePriceValue.formattedValue).toEqual(
        source.obsoletePriceValue.formattedValue
      );
      expect(result[0].obsoletePriceValue.value).toEqual(
        source.obsoletePriceValue.value
      );
    });
  });

  describe('convertAttributeSupplements', () => {
    it('should return a list with one attribute supplements', () => {
      const source: OccConfigurator.Supplements =
        OccConfiguratorTestUtils.createSupplements(1, 'attribute', 3);
      const result: Configurator.AttributeSupplement[] = [];
      classUnderTest.convertAttributeSupplements(source, result);
      expect(result?.length).toBe(1);
      expect(result[0].attributeUiKey).toEqual(source.csticUiKey);
      expect(result[0].valueSupplements.length).toEqual(
        source.priceSupplements.length
      );
      expect(result[0].valueSupplements[1].attributeValueKey).toEqual(
        source.priceSupplements[1].attributeValueKey
      );
      expect(result[0].valueSupplements[1].priceValue.formattedValue).toEqual(
        source.priceSupplements[1].priceValue.formattedValue
      );
      expect(result[0].valueSupplements[1].priceValue.value).toEqual(
        source.priceSupplements[1].priceValue.value
      );
    });
  });

  describe('convert', () => {
    it('should return a configuration with empty list of price supplements', () => {
      const result: Configurator.Configuration =
        classUnderTest.convert(emptySource);
      expect(result.priceSupplements?.length).toBe(0);
    });

    it('should return a configuration with a list of price supplements', () => {
      const source: OccConfigurator.Prices =
        OccConfiguratorTestUtils.createOccConfiguratorPrices(false, 1, 0, 3, 3);
      const result: Configurator.Configuration = classUnderTest.convert(source);
      expect(result.priceSupplements?.length).toBe(3);
      let suppl = result.priceSupplements
        ? result.priceSupplements[0]
        : undefined;
      expect(suppl).toBeDefined();
      if (suppl) {
        expect(suppl.attributeUiKey).toBe('group1@attribute_1_1');
        expect(suppl.valueSupplements.length).toBe(3);
        expect(suppl.valueSupplements[0].attributeValueKey).toBe('value_1_1');
        expect(suppl.valueSupplements[1].attributeValueKey).toBe('value_1_2');
        expect(suppl.valueSupplements[2].attributeValueKey).toBe('value_1_3');
      }
      suppl = result.priceSupplements ? result.priceSupplements[1] : undefined;
      expect(suppl).toBeDefined();
      if (suppl) {
        expect(suppl.attributeUiKey).toBe('group1@attribute_1_2');
        expect(suppl.valueSupplements.length).toBe(3);
        expect(suppl.valueSupplements[0].attributeValueKey).toBe('value_2_1');
        expect(suppl.valueSupplements[1].attributeValueKey).toBe('value_2_2');
        expect(suppl.valueSupplements[2].attributeValueKey).toBe('value_2_3');
      }
      suppl = result.priceSupplements ? result.priceSupplements[2] : undefined;
      expect(suppl).toBeDefined();
      if (suppl) {
        expect(suppl.attributeUiKey).toBe('group1@attribute_1_3');
        expect(suppl.valueSupplements.length).toBe(3);
        expect(suppl.valueSupplements[0].attributeValueKey).toBe('value_3_1');
        expect(suppl.valueSupplements[1].attributeValueKey).toBe('value_3_2');
        expect(suppl.valueSupplements[2].attributeValueKey).toBe('value_3_3');
      }
    });
    it('should set merge price supplements flag to false when performance optimization is active', () => {
      productConfigurationDeltaRenderingEnabled = true;
      const result = classUnderTest.convert(emptySource);
      expect(result.mergePriceSupplements).toBe(false);
    });

    it('should set merge price supplements flag to true when performance optimization is NOT active', () => {
      productConfigurationDeltaRenderingEnabled = false;
      const result = classUnderTest.convert(emptySource);
      expect(result.mergePriceSupplements).toBe(true);
    });
  });
});
