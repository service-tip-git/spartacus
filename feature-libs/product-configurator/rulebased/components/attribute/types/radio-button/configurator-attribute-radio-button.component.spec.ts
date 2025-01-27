import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { I18nTestingModule } from '@spartacus/core';
import { ItemCounterComponent } from '@spartacus/storefront';
import { CONFIGURATOR_FEATURE } from '../../../../core/state/configurator-state';
import { getConfiguratorReducers } from '../../../../core/state/reducers';

import { Observable, of } from 'rxjs';
import { CommonConfiguratorTestUtilsService } from '../../../../../common/testing/common-configurator-test-utils.service';
import { ConfiguratorGroupsService } from '../../../../core/facade/configurator-groups.service';
import { Configurator } from '../../../../core/model/configurator.model';
import { ConfiguratorTestUtils } from '../../../../testing/configurator-test-utils';
import { ConfiguratorPriceComponentOptions } from '../../../price/configurator-price.component';
import { ConfiguratorStorefrontUtilsService } from '../../../service/configurator-storefront-utils.service';
import { ConfiguratorAttributeCompositionContext } from '../../composition/configurator-attribute-composition.model';
import { ConfiguratorAttributeQuantityComponentOptions } from '../../quantity/configurator-attribute-quantity.component';
import { ConfiguratorAttributeInputFieldComponent } from '../input-field/configurator-attribute-input-field.component';
import { ConfiguratorAttributeNumericInputFieldComponent } from '../numeric-input-field/configurator-attribute-numeric-input-field.component';
import { ConfiguratorAttributeRadioButtonComponent } from './configurator-attribute-radio-button.component';
import { ConfiguratorAttributePriceChangeService } from '../../price-change/configurator-attribute-price-change.service';

const VALUE_NAME_2 = 'val2';

function createValue(code: string, name: string, isSelected: boolean) {
  const value: Configurator.Value = {
    valueCode: code,
    valueDisplay: name,
    name: name,
    selected: isSelected,
  };
  return value;
}

class MockGroupService {}

@Directive({
  selector: '[cxFocus]',
  standalone: false,
})
export class MockFocusDirective {
  @Input('cxFocus') protected config: any;
}

@Component({
  selector: 'cx-configurator-attribute-quantity',
  template: '',
  standalone: false,
})
class MockConfiguratorAttributeQuantityComponent {
  @Input() quantityOptions: ConfiguratorAttributeQuantityComponentOptions;
}

@Component({
  selector: 'cx-configurator-price',
  template: '',
  standalone: false,
})
class MockConfiguratorPriceComponent {
  @Input() formula: ConfiguratorPriceComponentOptions;
}

@Component({
  selector: 'cx-configurator-show-more',
  template: '',
  standalone: false,
})
class MockConfiguratorShowMoreComponent {
  @Input() text: string;
  @Input() textSize = 60;
  @Input() productName: string;
}

const isCartEntryOrGroupVisited = true;
class MockConfigUtilsService {
  isCartEntryOrGroupVisited(): Observable<boolean> {
    return of(isCartEntryOrGroupVisited);
  }
}

class MockConfiguratorAttributePriceChangeService {
  getChangedPrices(): Observable<Record<string, Configurator.PriceDetails>[]> {
    return of([]);
  }
}

describe('ConfigAttributeRadioButtonComponent', () => {
  let component: ConfiguratorAttributeRadioButtonComponent;
  let htmlElem: HTMLElement;
  let fixture: ComponentFixture<ConfiguratorAttributeRadioButtonComponent>;
  const ownerKey = 'theOwnerKey';
  const name = 'attributeName';
  const groupId = 'theGroupId';
  const initialSelectedValue = '1';

  let value1: Configurator.Value;
  let value2: Configurator.Value;
  let value3: Configurator.Value;
  let values: Configurator.Value[];

  beforeEach(waitForAsync(() => {
    value1 = createValue('1', 'val1', true);
    value2 = createValue('2', VALUE_NAME_2, false);
    value3 = createValue('3', 'val3', false);
    values = [value1, value2, value3];

    TestBed.overrideComponent(ConfiguratorAttributeRadioButtonComponent, {
      set: {
        providers: [
          {
            provide: ConfiguratorAttributePriceChangeService,
            useClass: MockConfiguratorAttributePriceChangeService,
          },
        ],
      },
    });
    TestBed.configureTestingModule({
      declarations: [
        ConfiguratorAttributeRadioButtonComponent,
        ConfiguratorAttributeInputFieldComponent,
        ConfiguratorAttributeNumericInputFieldComponent,
        ItemCounterComponent,
        MockFocusDirective,
        MockConfiguratorAttributeQuantityComponent,
        MockConfiguratorPriceComponent,
        MockConfiguratorShowMoreComponent,
      ],
      imports: [
        I18nTestingModule,
        ReactiveFormsModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(CONFIGURATOR_FEATURE, getConfiguratorReducers),
      ],
      providers: [
        ConfiguratorStorefrontUtilsService,
        {
          provide: ConfiguratorGroupsService,
          useClass: MockGroupService,
        },
        {
          provide: ConfiguratorAttributeCompositionContext,
          useValue: ConfiguratorTestUtils.getAttributeContext(),
        },
        {
          provide: ConfiguratorStorefrontUtilsService,
          useClass: MockConfigUtilsService,
        },
      ],
    })
      .overrideComponent(ConfiguratorAttributeRadioButtonComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ConfiguratorAttributeRadioButtonComponent
    );
    htmlElem = fixture.nativeElement;
    component = fixture.componentInstance;

    component.attribute = {
      name: name,
      label: name,
      attrCode: 444,
      uiType: Configurator.UiType.RADIOBUTTON,
      selectedSingleValue: initialSelectedValue,
      groupId: groupId,
      quantity: 1,
      dataType: Configurator.DataType.USER_SELECTION_QTY_ATTRIBUTE_LEVEL,
      values,
    };

    component.ownerKey = ownerKey;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedSingleValue on init', () => {
    expect(component.attributeRadioButtonForm.value).toEqual(
      initialSelectedValue
    );
  });

  describe('attribute level', () => {
    it('should not display quantity and price in case attribute does not carry quantity', () => {
      component.attribute.dataType =
        Configurator.DataType.USER_SELECTION_NO_QTY;
      fixture.detectChanges();

      CommonConfiguratorTestUtilsService.expectElementNotPresent(
        expect,
        htmlElem,
        '.cx-attribute-level-quantity-price'
      );
    });

    it('should display quantity and no price in case value price not present', () => {
      component.attribute.quantity = 5;
      component.attribute.attributePriceTotal = {
        currencyIso: '$',
        formattedValue: '500.00$',
        value: 500,
      };

      fixture.detectChanges();

      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        'cx-configurator-attribute-quantity'
      );

      CommonConfiguratorTestUtilsService.expectElementNotPresent(
        expect,
        htmlElem,
        '.cx-attribute-level-quantity-price cx-configurator-price'
      );
    });

    it('should display quantity and price in case attribute carries quantity and selected value has price', () => {
      component.attribute.quantity = 5;
      component.attribute.attributePriceTotal = {
        currencyIso: '$',
        formattedValue: '500.00$',
        value: 500,
      };

      value1.valuePrice = {
        currencyIso: '$',
        formattedValue: '$100.00',
        value: 100,
      };

      fixture.detectChanges();

      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        'cx-configurator-attribute-quantity'
      );

      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        '.cx-attribute-level-quantity-price cx-configurator-price'
      );
    });
  });

  describe('value level', () => {
    it('should not display quantity', () => {
      component.attribute.dataType =
        Configurator.DataType.USER_SELECTION_NO_QTY;
      fixture.detectChanges();
      CommonConfiguratorTestUtilsService.expectElementNotPresent(
        expect,
        htmlElem,
        'cx-configurator-attribute-quantity'
      );
    });

    it('should display price formula', () => {
      value1.valuePrice = {
        currencyIso: '$',
        formattedValue: '$100.00',
        value: 100,
      };

      fixture.detectChanges();

      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        'cx-configurator-price'
      );
    });

    it('should not render description in case description not present on model', () => {
      CommonConfiguratorTestUtilsService.expectElementNotPresent(
        expect,
        htmlElem,
        'cx-configurator-show-more'
      );
    });

    it('should render description in case description is present on model', () => {
      (component.attribute.values ?? [{ description: '' }])[0].description =
        'Here is a description at value level';
      fixture.detectChanges();
      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        'cx-configurator-show-more'
      );
    });
  });

  describe('Accessibility', () => {
    it("should contain input element with class name 'form-check-input' and 'aria-label' attribute that defines an accessible name to label the current unselected element", () => {
      CommonConfiguratorTestUtilsService.expectElementContainsA11y(
        expect,
        htmlElem,
        'input',
        'form-check-input',
        1,
        'aria-label',
        'configurator.a11y.valueOfAttributeFull attribute:' +
          component.attribute.label +
          ' value:' +
          VALUE_NAME_2
      );
    });

    it("should contain input element with class name 'form-check-input' and 'aria-label' attribute that defines an accessible name to label the current selected element", () => {
      value1.selected = false;
      value2.selected = true;
      fixture.detectChanges();
      CommonConfiguratorTestUtilsService.expectElementContainsA11y(
        expect,
        htmlElem,
        'input',
        'form-check-input',
        1,
        'aria-label',
        'configurator.a11y.selectedValueOfAttributeFull attribute:' +
          component.attribute.label +
          ' value:' +
          VALUE_NAME_2
      );
    });

    it("should contain input element with class name 'form-check-input' and 'aria-describedby' attribute that indicates the ID of the element that describe the elements", () => {
      CommonConfiguratorTestUtilsService.expectElementContainsA11y(
        expect,
        htmlElem,
        'input',
        'form-check-input',
        1,
        'aria-describedby',
        'cx-configurator--label--attributeName'
      );
    });

    it("should contain label element with class name 'form-check-label' and 'aria-hidden' attribute that removes label from the accessibility tree", () => {
      CommonConfiguratorTestUtilsService.expectElementContainsA11y(
        expect,
        htmlElem,
        'label',
        'form-check-label',
        1,
        'aria-hidden',
        'true',
        VALUE_NAME_2
      );
    });

    it('selected value should have aria-live tag if delta rendering is active', () => {
      component.listenForPriceChanges = true;
      fixture.detectChanges();
      CommonConfiguratorTestUtilsService.expectElementContainsA11y(
        expect,
        htmlElem,
        'input',
        'form-check-input',
        0,
        'aria-live',
        'polite'
      );
    });

    it('selected value should not have aria-live tag if delta rendering is not active', () => {
      component.listenForPriceChanges = false;
      fixture.detectChanges();
      CommonConfiguratorTestUtilsService.expectElementNotPresent(
        expect,
        htmlElem,
        'input[aria-live]'
      );
    });
  });

  describe('Rendering for additional value', () => {
    it('should provide input field for alpha numeric value ', () => {
      component.attribute.uiType =
        Configurator.UiType.RADIOBUTTON_ADDITIONAL_INPUT;
      component.attribute.validationType = Configurator.ValidationType.NONE;
      fixture.detectChanges();
      htmlElem = fixture.nativeElement;
      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        'cx-configurator-attribute-input-field'
      );
    });

    it('should provide input field for numeric value ', () => {
      component.attribute.uiType =
        Configurator.UiType.RADIOBUTTON_ADDITIONAL_INPUT;
      component.attribute.validationType = Configurator.ValidationType.NUMERIC;
      fixture.detectChanges();
      htmlElem = fixture.nativeElement;
      CommonConfiguratorTestUtilsService.expectElementPresent(
        expect,
        htmlElem,
        'cx-configurator-attribute-numeric-input-field'
      );
    });
  });
});
