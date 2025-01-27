import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { I18nTestingModule } from '@spartacus/core';
import { Observable, of } from 'rxjs';
import { CommonConfiguratorTestUtilsService } from '../../../../../common/testing/common-configurator-test-utils.service';
import { ConfiguratorCommonsService } from '../../../../core/facade/configurator-commons.service';
import { Configurator } from '../../../../core/model/configurator.model';
import { ConfiguratorTestUtils } from '../../../../testing/configurator-test-utils';
import { ConfiguratorPriceComponentOptions } from '../../../price/configurator-price.component';
import { ConfiguratorStorefrontUtilsService } from '../../../service/configurator-storefront-utils.service';
import { ConfiguratorAttributeCompositionContext } from '../../composition/configurator-attribute-composition.model';
import { ConfiguratorAttributePriceChangeService } from '../../price-change/configurator-attribute-price-change.service';
import { ConfiguratorAttributeCheckBoxComponent } from './configurator-attribute-checkbox.component';

@Directive({
  selector: '[cxFocus]',
  standalone: false,
})
export class MockFocusDirective {
  @Input('cxFocus') protected config: string;
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

class MockConfiguratorCommonsService {
  updateConfiguration(): void {}
}

class MockConfiguratorStorefrontUtilsService {
  lastSelected?: { attributeName: string; valueCode: string };
  setLastSelected(attributeName: string, valueCode: string): void {
    this.lastSelected = { attributeName, valueCode };
  }
  isLastSelected(attributeName: string, valueCode: string): boolean {
    return (
      !!this.lastSelected &&
      this.lastSelected.attributeName === attributeName &&
      this.lastSelected.valueCode === valueCode
    );
  }
}

class MockConfiguratorAttributePriceChangeService {
  getChangedPrices(): Observable<Record<string, Configurator.PriceDetails>[]> {
    return of([]);
  }
}

describe('ConfigAttributeCheckBoxComponent', () => {
  let component: ConfiguratorAttributeCheckBoxComponent;
  let fixture: ComponentFixture<ConfiguratorAttributeCheckBoxComponent>;
  let htmlElem: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.overrideComponent(ConfiguratorAttributeCheckBoxComponent, {
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
        ConfiguratorAttributeCheckBoxComponent,
        MockFocusDirective,
        MockConfiguratorPriceComponent,
        MockConfiguratorShowMoreComponent,
      ],
      imports: [ReactiveFormsModule, NgSelectModule, I18nTestingModule],
      providers: [
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
          useClass: MockConfiguratorStorefrontUtilsService,
        },
      ],
    })
      .overrideComponent(ConfiguratorAttributeCheckBoxComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();
  }));

  function createValue(code: string, name: string, isSelected: boolean) {
    const value: Configurator.Value = {
      valueDisplay: name,
      valueCode: code,
      name: name,
      selected: isSelected,
    };
    return value;
  }

  const value1 = createValue('1', 'val1', false);
  beforeEach(() => {
    const values: Configurator.Value[] = [value1];

    fixture = TestBed.createComponent(ConfiguratorAttributeCheckBoxComponent);
    component = fixture.componentInstance;
    htmlElem = fixture.nativeElement;

    component.attribute = {
      label: 'attributeName',
      name: 'attributeName',
      attrCode: 444,
      uiType: Configurator.UiType.CHECKBOX,
      values: values,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an entry after init with empty value', () => {
    expect(component.attributeCheckBoxForm.value).toBeFalsy();
  });

  describe('getValueFromAttribute', () => {
    it('should find value in case values present on attribute', () => {
      expect(component['getValueFromAttribute']()).toBe(value1);
    });

    it('should return empty value if no values are present', () => {
      component.attribute.values = undefined;
      expect(component['getValueFromAttribute']()).toEqual({ valueCode: '' });
    });
  });

  it('should select and deselect a checkbox value', () => {
    const checkboxId =
      '#cx-configurator--checkBox--' +
      component.attribute.name +
      '--' +
      value1.valueCode;
    const valueToSelect = fixture.debugElement.query(
      By.css(checkboxId)
    ).nativeElement;
    expect(valueToSelect.checked).toBeFalsy();
    // select value
    valueToSelect.click();
    fixture.detectChanges();
    expect(valueToSelect.checked).toBeTruthy();
    // deselect value
    valueToSelect.click();
    fixture.detectChanges();
    expect(valueToSelect.checked).toBeFalsy();
  });

  it('should set last selected value code on select if listening for price changes', () => {
    component.listenForPriceChanges = true;
    component.onSelect('123');
    expect(component.isLastSelected(component.attribute.name, '123')).toBe(
      true
    );
  });

  it('should not set last selected value code on select if delta rendering is not activated', () => {
    component.onSelect('123');
    expect(component.isLastSelected(component.attribute.name, '123')).toBe(
      false
    );
  });

  describe('rendering description at value level', () => {
    it('should not render description in case description not present on model', () => {
      (component.attribute.values ?? [{ description: '' }])[0].description =
        undefined;
      fixture.detectChanges();
      CommonConfiguratorTestUtilsService.expectElementNotPresent(
        expect,
        htmlElem,
        'cx-configurator-show-more'
      );
    });

    it('should render description in case description present on model', () => {
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
    it("should contain input element with class name 'form-check-input' and 'aria-label' attribute that defines an accessible name to label the current element", () => {
      CommonConfiguratorTestUtilsService.expectElementContainsA11y(
        expect,
        htmlElem,
        'input',
        'form-check-input',
        0,
        'aria-label',
        'configurator.a11y.valueOfAttributeFull attribute:' +
          component.attribute.label +
          ' value:' +
          value1.valueDisplay
      );
    });

    it("should contain input element with class name 'form-check-input' and 'aria-describedby' that indicates the IDs of the elements that describe the elements", () => {
      CommonConfiguratorTestUtilsService.expectElementContainsA11y(
        expect,
        htmlElem,
        'input',
        'form-check-input',
        0,
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
        0,
        'aria-hidden',
        'true',
        value1.valueDisplay
      );
    });

    it('should create input element for last selected value with aria-live', () => {
      component.listenForPriceChanges = true;
      component.onSelect('1');
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

    it('should create input element for not last selected value without aria-live', () => {
      fixture.detectChanges();
      const item = CommonConfiguratorTestUtilsService.getHTMLElement(
        htmlElem,
        'input',
        'form-check-input',
        0
      );
      const attributes = item?.attributes;
      expect(attributes?.hasOwnProperty('aria-live')).toBe(false);
    });
  });
});
