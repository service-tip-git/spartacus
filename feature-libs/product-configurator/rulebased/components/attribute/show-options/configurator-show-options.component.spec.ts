import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfiguratorShowOptionsComponent } from './configurator-show-options.component';
import { I18nTestingModule } from '@spartacus/core';
import { ConfiguratorCommonsService } from '../../../core/facade/configurator-commons.service';
import { CommonConfiguratorTestUtilsService } from '../../../../common/testing/common-configurator-test-utils.service';
import { By } from '@angular/platform-browser';
import { ConfiguratorTestUtils } from '../../../testing/configurator-test-utils';

class MockConfiguratorCommonsService {
  readAttributeDomain() {}
}

describe('ConfiguratorShowOptionsComponent', () => {
  let component: ConfiguratorShowOptionsComponent;
  let fixture: ComponentFixture<ConfiguratorShowOptionsComponent>;
  let htmlElem: HTMLElement;
  let configuratorCommonsService: ConfiguratorCommonsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfiguratorShowOptionsComponent],
      imports: [I18nTestingModule],
      providers: [
        {
          provide: ConfiguratorCommonsService,
          useClass: MockConfiguratorCommonsService,
        },
      ],
    }).compileComponents();

    configuratorCommonsService = TestBed.inject(ConfiguratorCommonsService);
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
});
