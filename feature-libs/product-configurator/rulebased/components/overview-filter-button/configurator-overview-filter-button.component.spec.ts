import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { I18nTestingModule } from '@spartacus/core';
import {
  CommonConfigurator,
  ConfiguratorRouterExtractorService,
} from '@spartacus/product-configurator/common';
import { LAUNCH_CALLER, LaunchDialogService } from '@spartacus/storefront';
import { EMPTY, NEVER, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CommonConfiguratorTestUtilsService } from '../../../common/testing/common-configurator-test-utils.service';
import { ConfiguratorCommonsService } from '../../core';
import { Configurator } from '../../core/model/configurator.model';
import * as ConfigurationTestData from '../../testing/configurator-test-data';
import { ConfiguratorTestUtils } from '../../testing/configurator-test-utils';
import { ConfiguratorOverviewFilterButtonComponent } from './configurator-overview-filter-button.component';
import { ConfiguratorStorefrontUtilsService } from '@spartacus/product-configurator/rulebased';

const owner: CommonConfigurator.Owner =
  ConfigurationTestData.productConfiguration.owner;
const configId = '1234-56-7890';

const PRICE_RELEVANT = Configurator.OverviewFilter.PRICE_RELEVANT;

let component: ConfiguratorOverviewFilterButtonComponent;
let fixture: ComponentFixture<ConfiguratorOverviewFilterButtonComponent>;
let htmlElem: HTMLElement;

let mockLaunchDialogService: LaunchDialogService;
let mockConfigRouterService: ConfiguratorRouterExtractorService;
let mockConfigCommonsService: ConfiguratorCommonsService;

let ovConfig: Configurator.ConfigurationWithOverview;

function asSpy(f: any) {
  return <jasmine.Spy>f;
}

function initTestData() {
  ovConfig = structuredClone({
    ...ConfiguratorTestUtils.createConfiguration(configId, owner),
    overview: ConfigurationTestData.productConfiguration.overview
      ? ConfigurationTestData.productConfiguration.overview
      : { configId: '', productCode: '' },
  });
  ovConfig.overview.possibleGroups = structuredClone(ovConfig.overview.groups);
}

function initComponent() {
  fixture = TestBed.createComponent(ConfiguratorOverviewFilterButtonComponent);
  htmlElem = fixture.nativeElement;
  component = fixture.componentInstance;
  isDisplayOnlyVariant = false;
  fixture.detectChanges();
}

function initMocks() {
  mockLaunchDialogService = jasmine.createSpyObj(['openDialogAndSubscribe']);
  mockConfigRouterService = jasmine.createSpyObj(['extractRouterData']);
  mockConfigCommonsService = jasmine.createSpyObj(['getConfiguration']);
  asSpy(mockConfigRouterService.extractRouterData).and.returnValue(
    of(ConfigurationTestData.mockRouterState)
  );
  asSpy(mockConfigCommonsService.getConfiguration).and.returnValue(
    of(ovConfig).pipe(delay(0)) // delay(0) to avoid NG0100 error in test
  );
  asSpy(mockLaunchDialogService.openDialogAndSubscribe).and.returnValue(EMPTY);
}

@Component({
  selector: 'cx-configurator-overview-filter-bar',
  template: '',
  standalone: false,
})
class MockConfiguratorOverviewFilterBarComponent {
  @Input() config: Configurator.ConfigurationWithOverview;
}

let isDisplayOnlyVariant: boolean;

class MockConfiguratorStorefrontUtilsService {
  isDisplayOnlyVariant(): Observable<boolean> {
    return of(isDisplayOnlyVariant);
  }
}

describe('ConfigurationOverviewFilterButtonComponent', () => {
  beforeEach(waitForAsync(() => {
    initTestData();
    initMocks();
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [
        ConfiguratorOverviewFilterButtonComponent,
        MockConfiguratorOverviewFilterBarComponent,
      ],
      providers: [
        { provide: LaunchDialogService, useValue: mockLaunchDialogService },
        {
          provide: ConfiguratorRouterExtractorService,
          useValue: mockConfigRouterService,
        },
        {
          provide: ConfiguratorCommonsService,
          useValue: mockConfigCommonsService,
        },
        {
          provide: ConfiguratorStorefrontUtilsService,
          useClass: MockConfiguratorStorefrontUtilsService,
        },
      ],
    }).compileComponents();
    initComponent();
  }));

  beforeEach(() => {
    fixture.detectChanges(); //due to the additional delay(0)
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });

  it('should open filter modal on request', () => {
    fixture.debugElement
      .query(By.css('.cx-config-filter-button'))
      .triggerEventHandler('click');
    expect(mockLaunchDialogService.openDialogAndSubscribe).toHaveBeenCalledWith(
      LAUNCH_CALLER.CONFIGURATOR_OV_FILTER,
      component.filterButton,
      ovConfig
    );
  });

  it('should render filter button', () => {
    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      '.cx-config-filter-button'
    );
    expect(htmlElem.classList.contains('ghost')).toBeFalsy();
  });

  it('should render filter button for variant in case there is more than one group', () => {
    isDisplayOnlyVariant = true;
    fixture.detectChanges();

    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      '.cx-config-filter-button'
    );
  });

  it('should render no filter button for variant in case there is only one group', () => {
    isDisplayOnlyVariant = true;
    ovConfig.overview.possibleGroups =
      ovConfig.overview.possibleGroups.slice(1);
    fixture.detectChanges();

    CommonConfiguratorTestUtilsService.expectElementNotPresent(
      expect,
      htmlElem,
      '.cx-config-filter-button'
    );
  });

  it('should render filter button with count if there are active filters', () => {
    ovConfig.overview.attributeFilters = [PRICE_RELEVANT];
    fixture.detectChanges();
    CommonConfiguratorTestUtilsService.expectElementToContainText(
      expect,
      htmlElem,
      '.cx-config-filter-button',
      'configurator.button.filterOverviewWithCount numAppliedFilters:1'
    );
  });

  it('should render filter button without count if there are no active filters', () => {
    CommonConfiguratorTestUtilsService.expectElementToContainText(
      expect,
      htmlElem,
      '.cx-config-filter-button',
      'configurator.button.filterOverview numAppliedFilters:0'
    );
  });

  it('while loading should not render filter button but ghost button instead', () => {
    asSpy(mockConfigCommonsService.getConfiguration).and.returnValue(NEVER);
    initComponent();
    CommonConfiguratorTestUtilsService.expectElementNotPresent(
      expect,
      htmlElem,
      '.cx-config-filter-button'
    );

    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      '.cx-ghost-filter-button'
    );

    expect(htmlElem.classList.contains('ghost')).toBeTruthy();
  });

  describe('to support A11Y', () => {
    it('filter button should have descriptive title', () => {
      CommonConfiguratorTestUtilsService.expectElementToHaveAttributeWithValue(
        expect,
        htmlElem,
        '.cx-config-filter-button',
        'title',
        'configurator.a11y.filterOverview numAppliedFilters:0'
      );
    });

    it('filter button should have descriptive title with count', () => {
      ovConfig.overview.attributeFilters = [PRICE_RELEVANT];
      ovConfig.overview.groupFilters = ['1', '2'];
      fixture.detectChanges();
      CommonConfiguratorTestUtilsService.expectElementToHaveAttributeWithValue(
        expect,
        htmlElem,
        '.cx-config-filter-button',
        'title',
        'configurator.a11y.filterOverviewWithCount numAppliedFilters:3'
      );
    });
  });

  describe('getNumFilters', () => {
    it('should return 0 when there are no filters', () => {
      expect(component.getNumFilters(ovConfig.overview)).toEqual(0);
    });

    it('should return 3 when there are 2 group filters and one attribute filter', () => {
      ovConfig.overview.attributeFilters = [
        Configurator.OverviewFilter.USER_INPUT,
      ];
      ovConfig.overview.groupFilters = ['1', '2'];
      expect(component.getNumFilters(ovConfig.overview)).toEqual(3);
    });
  });
});
