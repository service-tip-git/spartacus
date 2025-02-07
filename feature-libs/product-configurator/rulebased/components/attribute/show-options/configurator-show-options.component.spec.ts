import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfiguratorShowOptionsComponent } from './configurator-show-options.component';
import { I18nTestingModule } from '@spartacus/core';
import { ConfiguratorCommonsService } from '../../../core/facade/configurator-commons.service';
import { CommonConfiguratorTestUtilsService } from '../../../../common/testing/common-configurator-test-utils.service';
import { ConfiguratorStorefrontUtilsService } from '../../service/configurator-storefront-utils.service';
import { By } from '@angular/platform-browser';
import { getTestScheduler } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { ConfiguratorTestUtils } from '../../../testing/configurator-test-utils';

class MockConfiguratorCommonsService {
  readAttributeDomain() {}
  isConfigurationLoading(): Observable<boolean> {
    return of(false);
  }
}

class MockConfiguratorStorefrontUtilsService {
  focusFirstActiveElement() {}
  createAttributeUiKey() {}
}

describe('ConfiguratorShowOptionsComponent', () => {
  let component: ConfiguratorShowOptionsComponent;
  let fixture: ComponentFixture<ConfiguratorShowOptionsComponent>;
  let htmlElem: HTMLElement;
  let configuratorCommonsService: ConfiguratorCommonsService;
  let configuratorStorefrontUtilsService: ConfiguratorStorefrontUtilsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfiguratorShowOptionsComponent],
      imports: [I18nTestingModule],
      providers: [
        {
          provide: ConfiguratorCommonsService,
          useClass: MockConfiguratorCommonsService,
        },
        {
          provide: ConfiguratorStorefrontUtilsService,
          useClass: MockConfiguratorStorefrontUtilsService,
        },
      ],
    }).compileComponents();

    configuratorCommonsService = TestBed.inject(ConfiguratorCommonsService);
    configuratorStorefrontUtilsService = TestBed.inject(
      ConfiguratorStorefrontUtilsService
    );
    spyOn(configuratorCommonsService, 'readAttributeDomain');
    fixture = TestBed.createComponent(ConfiguratorShowOptionsComponent);
    component = fixture.componentInstance;
    htmlElem = fixture.nativeElement;

    component.attributeComponentContext =
      ConfiguratorTestUtils.getAttributeContext();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render "Show Options" button', () => {
    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      '.btn'
    );
  });

  it('should delegate to configurator commons service when clicking "Show Options" button', () => {
    fixture.debugElement.query(By.css('.btn')).nativeElement.click();
    expect(configuratorCommonsService.readAttributeDomain).toHaveBeenCalledWith(
      component.attributeComponentContext.owner,
      component.attributeComponentContext.group,
      component.attributeComponentContext.attribute
    );
  });

  describe('focusFirstValue', () => {
    it('should call focusFirstActiveElement of configurator storefront utils service ', () => {
      //we need to run the test in a test scheduler
      //because of the delay() in method focusFirstValue
      getTestScheduler().run(({ cold, flush }) => {
        const configurationLoading = cold('-a-b-c', {
          a: false,
          b: true,
          c: false,
        });
        spyOn(
          configuratorCommonsService,
          'isConfigurationLoading'
        ).and.returnValue(configurationLoading);
        spyOn(
          configuratorStorefrontUtilsService,
          'focusFirstActiveElement'
        ).and.callThrough();
        component['focusFirstValue']();
        flush();
        expect(
          configuratorStorefrontUtilsService.focusFirstActiveElement
        ).toHaveBeenCalledTimes(1);
      });
    });
  });
});
