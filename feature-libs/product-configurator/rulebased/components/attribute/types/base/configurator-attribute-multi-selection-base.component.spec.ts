import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Configurator } from '../../../../core/model/configurator.model';
import { ConfiguratorAttributeCompositionContext } from '../../composition/configurator-attribute-composition.model';
import { ConfiguratorAttributeQuantityComponentOptions } from '../../quantity/configurator-attribute-quantity.component';
import { ConfiguratorAttributeQuantityService } from '../../quantity/configurator-attribute-quantity.service';
import { ConfiguratorAttributeMultiSelectionBaseComponent } from './configurator-attribute-multi-selection-base.component';
import { ConfiguratorTestUtils } from '../../../../testing/configurator-test-utils';
import { ConfiguratorCommonsService } from '../../../../core/facade/configurator-commons.service';
import { I18nTestingModule } from '@spartacus/core';
import { ConfiguratorStorefrontUtilsService } from '../../../service/configurator-storefront-utils.service';

const createTestValue = (
  price: number | undefined,
  total: number | undefined,
  selected = true
): Configurator.Value => ({
  valueCode: 'a',
  selected,
  valuePrice: {
    currencyIso: '$',
    formattedValue: price ? '$' + price : '',
    value: price ?? 0,
  },
  valuePriceTotal: {
    currencyIso: '$',
    formattedValue: price ? '$' + price : '',
    value: total ?? 0,
  },
});

@Component({
  selector: 'cx-configurator-attribute-multi-selection',
  standalone: false,
})
class ExampleConfiguratorAttributeMultiSelectionComponent extends ConfiguratorAttributeMultiSelectionBaseComponent {
  constructor(
    protected quantityService: ConfiguratorAttributeQuantityService,
    protected attributeComponentContext: ConfiguratorAttributeCompositionContext,
    protected configuratorCommonsService: ConfiguratorCommonsService
  ) {
    super(
      quantityService,
      attributeComponentContext,
      configuratorCommonsService
    );
  }
}
class MockConfiguratorCommonsService {
  updateConfiguration(): void {}
}

describe('ConfiguratorAttributeMultiSelectionBaseComponent', () => {
  let component: ConfiguratorAttributeMultiSelectionBaseComponent;
  let fixture: ComponentFixture<ExampleConfiguratorAttributeMultiSelectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExampleConfiguratorAttributeMultiSelectionComponent],
      imports: [I18nTestingModule],
      providers: [
        ConfiguratorAttributeQuantityService,
        {
          provide: ConfiguratorAttributeCompositionContext,
          useValue: ConfiguratorTestUtils.getAttributeContext(),
        },
        {
          provide: ConfiguratorCommonsService,
          useClass: MockConfiguratorCommonsService,
        },
        {
          provide: ConfiguratorStorefrontUtilsService,
          useValue: {},
        },
      ],
    }).compileComponents();
  }));

  function createValue(code: string, name: string, isSelected: boolean) {
    const value: Configurator.Value = {
      valueCode: code,
      name: name,
      selected: isSelected,
    };
    return value;
  }
  let values: Configurator.Value[];

  beforeEach(() => {
    const value1 = createValue('1', 'val1', true);
    const value2 = createValue('2', 'val2', false);
    const value3 = createValue('3', 'val3', true);
    values = [value1, value2, value3];

    fixture = TestBed.createComponent(
      ExampleConfiguratorAttributeMultiSelectionComponent
    );

    component = fixture.componentInstance;

    component.ownerKey = 'theOwnerKey';
    component.attribute = {
      dataType: Configurator.DataType.USER_SELECTION_QTY_VALUE_LEVEL,
      name: 'attributeName',
      attrCode: 444,
      uiType: Configurator.UiType.CHECKBOXLIST,
      values: values,
      required: true,
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('withQuantity', () => {
    it('should allow quantity', () => {
      expect(component.withQuantity).toBe(true);
    });
    it('should be able to handle empty UI type', () => {
      component.attribute.uiType = undefined;
      expect(component.withQuantity).toBe(false);
    });
  });

  describe('withQuantityOnAttributeLevel', () => {
    it('should allow quantity on attribute level when specified as attribute level', () => {
      component.attribute.dataType =
        Configurator.DataType.USER_SELECTION_QTY_ATTRIBUTE_LEVEL;
      fixture.detectChanges();
      expect(component.withQuantityOnAttributeLevel).toBe(true);
    });

    it('should not allow quantity on attribute level when specified as value level', () => {
      (component.attribute.dataType =
        Configurator.DataType.USER_SELECTION_QTY_VALUE_LEVEL),
        fixture.detectChanges();
      expect(component.withQuantityOnAttributeLevel).toBe(false);
    });
  });

  describe('disableQuantityActions', () => {
    it('should allow quantity actions', () => {
      expect(component.disableQuantityActions).toBe(false);
    });
  });

  describe('extractQuantityParameters', () => {
    it('should set initial quantity and allow zero', () => {
      const quantityOptions: ConfiguratorAttributeQuantityComponentOptions =
        component.extractQuantityParameters(2, true);
      expect(quantityOptions.initialQuantity).toBe(2);
      expect(quantityOptions.allowZero).toBe(true);
    });

    it('should set allow zero from attribute, if undefined', () => {
      const quantityOptions: ConfiguratorAttributeQuantityComponentOptions =
        component.extractQuantityParameters(1);
      expect(quantityOptions.allowZero).toBe(false);
    });

    it('should take over loading observable into result ', () => {
      component.loading$.next(false);
      const quantityOptions: ConfiguratorAttributeQuantityComponentOptions =
        component.extractQuantityParameters(1);
      expect(quantityOptions.allowZero).toBe(false);
      quantityOptions.disableQuantityActions$?.subscribe((disable) =>
        expect(disable).toBe(false)
      );
    });
  });

  describe('onHandleAttributeQuantity', () => {
    it('should call facade update onHandleAttributeQuantity', () => {
      const quantity = 2;
      spyOn(
        component['configuratorCommonsService'],
        'updateConfiguration'
      ).and.callThrough();
      component['onHandleAttributeQuantity'](quantity);
      expect(
        component['configuratorCommonsService'].updateConfiguration
      ).toHaveBeenCalledWith(
        component.ownerKey,
        { ...component.attribute, quantity: 2 },
        Configurator.UpdateType.ATTRIBUTE_QUANTITY
      );
    });
  });

  describe('extractPriceFormulaParameters', () => {
    it('should return ConfiguratorPriceComponentOptions object', () => {
      component.attribute.attributePriceTotal = {
        currencyIso: '$',
        formattedValue: '$1000',
        value: 1000,
      };
      fixture.detectChanges();
      const priceFormulaParameters = component.extractPriceFormulaParameters();
      expect(priceFormulaParameters?.quantity).toBe(0);
      expect(priceFormulaParameters?.price?.value).toBe(0);
      expect(priceFormulaParameters?.price?.currencyIso).toBe('');
      expect(priceFormulaParameters?.priceTotal).toBe(
        component.attribute.attributePriceTotal
      );
      expect(priceFormulaParameters?.isLightedUp).toBe(true);
    });
  });

  describe('extractValuePriceFormulaParameters', () => {
    it('should return price formula parameters', () => {
      const value = createTestValue(100, 100, true);
      value.quantity = 5;
      const priceFormulaParameters =
        component.extractValuePriceFormulaParameters(value);
      expect(priceFormulaParameters?.quantity).toBe(value?.quantity);
      expect(priceFormulaParameters?.price?.value).toBe(
        value?.valuePrice?.value
      );
      expect(priceFormulaParameters?.priceTotal?.value).toBe(
        value?.valuePriceTotal?.value
      );
      expect(priceFormulaParameters?.isLightedUp).toBe(value?.selected);
    });
  });
});
