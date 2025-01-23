import { TestBed } from '@angular/core/testing';
import { Configurator } from '@spartacus/product-configurator/rulebased';
import {
  attributeCheckBoxes,
  attrCode,
  groupId,
  attributeRadioButtons,
  productConfiguration,
} from '../../testing/configurator-test-data';
import { ConfiguratorTestUtils } from '../../testing/configurator-test-utils';
import { CpqConfiguratorUtils } from './cpq-configurator-utils';

describe('CpqConfiguratorUtils', () => {
  let classUnderTest: CpqConfiguratorUtils;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    classUnderTest = new CpqConfiguratorUtils();
  });

  it('should be created', () => {
    expect(classUnderTest).toBeTruthy();
  });

  describe('findFirstChangedAttribute', () => {
    it('should find first attribute correctly', () => {
      const attribute: Configurator.Attribute =
        CpqConfiguratorUtils.findFirstChangedAttribute(productConfiguration);
      expect(attribute).toBe(attributeCheckBoxes);
    });

    it('should throw an error in case no attribute is available', () => {
      const emptyConfiguration = ConfiguratorTestUtils.createConfiguration('1');
      expect(() =>
        CpqConfiguratorUtils.findFirstChangedAttribute(emptyConfiguration)
      ).toThrowError();
    });
  });

  describe('getUpdateInformation', () => {
    it('should get attribute fields we need to do the CPQ update', () => {
      const updateInformation =
        CpqConfiguratorUtils.getUpdateInformation(attributeCheckBoxes);

      expect(updateInformation.standardAttributeCode).toBe(attrCode.toString());
      expect(updateInformation.tabId).toBe(groupId);
    });

    it('should throw an error if the necessary fields are not available on attribute level', () => {
      expect(() =>
        CpqConfiguratorUtils.getUpdateInformation(attributeRadioButtons)
      ).toThrowError();
    });
  });
});
