import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';

import {
  CommonConfigurator,
  ConfiguratorModelUtils,
  ConfiguratorRouterExtractorService,
  ConfiguratorType,
} from '@spartacus/product-configurator/common';
import { Observable, of } from 'rxjs';
import { ConfiguratorRouter } from '../../../common/components/service/configurator-router-data';
import { CommonConfiguratorTestUtilsService } from '../../../common/testing/common-configurator-test-utils.service';
import { ConfiguratorCommonsService } from '../../core/facade/configurator-commons.service';
import { Configurator } from '../../core/model/configurator.model';
import {
  CONFIG_ID,
  productConfiguration,
  productConfigurationWithConflicts,
  productConfigurationWithoutIssues,
} from '../../testing/configurator-test-data';
import { ConfiguratorOverviewNotificationBannerComponent } from './configurator-overview-notification-banner.component';

@Pipe({
  name: 'cxTranslate',
})
class MockTranslatePipe implements PipeTransform {
  transform(): any {}
}

@Pipe({
  name: 'cxUrl',
})
class MockUrlPipe implements PipeTransform {
  transform(): any {}
}

const productConfigurationWithDetailedIssuesCountedInOverview: Configurator.Configuration =
  {
    ...productConfigurationWithConflicts,
    totalNumberOfIssues: 0,
    overview: {
      configId: CONFIG_ID,
      productCode: productConfigurationWithConflicts.productCode,
      totalNumberOfIssues: 5,
      numberOfConflicts: 3,
      numberOfIncompleteCharacteristics: 2,
    },
  };

const productConfigurationWithOnlyTotalIssuesCountedInOverview: Configurator.Configuration =
  {
    ...productConfigurationWithConflicts,
    totalNumberOfIssues: 0,
    overview: {
      configId: CONFIG_ID,
      productCode: productConfigurationWithConflicts.productCode,
      totalNumberOfIssues: 5,
    },
  };

const productConfigurationWithIssues: Configurator.Configuration = {
  ...productConfigurationWithConflicts,
  overview: {
    configId: productConfigurationWithConflicts.configId,
    productCode: productConfigurationWithConflicts.productCode,
  },
};

const configuratorType = ConfiguratorType.VARIANT;

const routerData: ConfiguratorRouter.Data = {
  pageType: ConfiguratorRouter.PageType.OVERVIEW,
  isOwnerCartEntry: true,
  owner: ConfiguratorModelUtils.createOwner(
    CommonConfigurator.OwnerType.CART_ENTRY,
    '3',
    configuratorType
  ),
};

const orderRouterData: ConfiguratorRouter.Data = {
  pageType: ConfiguratorRouter.PageType.OVERVIEW,
  isOwnerCartEntry: true,
  owner: ConfiguratorModelUtils.createOwner(
    CommonConfigurator.OwnerType.ORDER_ENTRY,
    '3',
    configuratorType
  ),
};

let routerObs: any;
class MockConfigRouterExtractorService {
  extractRouterData() {
    return routerObs;
  }
}

let configurationObs: Observable<Configurator.Configuration>;
class MockConfiguratorCommonsService {
  getConfiguration(): Observable<Configurator.Configuration> {
    return configurationObs;
  }
}
let component: ConfiguratorOverviewNotificationBannerComponent;
let fixture: ComponentFixture<ConfiguratorOverviewNotificationBannerComponent>;
let htmlElem: HTMLElement;
function initialize(router: ConfiguratorRouter.Data) {
  routerObs = of(router);
  fixture = TestBed.createComponent(
    ConfiguratorOverviewNotificationBannerComponent
  );
  component = fixture.componentInstance;
  htmlElem = fixture.nativeElement;
  fixture.detectChanges();
}
@Component({
  selector: 'cx-icon',
  template: '',
})
class MockCxIconComponent {
  @Input() type: any;
}

class MockActivatedRoute {
  constructor(public snapshot: any) {}
}

describe('ConfigOverviewNotificationBannerComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule],
      declarations: [
        ConfiguratorOverviewNotificationBannerComponent,
        MockTranslatePipe,
        MockUrlPipe,
        MockCxIconComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: new MockActivatedRoute({}) },
        {
          provide: ConfiguratorRouterExtractorService,
          useClass: MockConfigRouterExtractorService,
        },
        {
          provide: ConfiguratorCommonsService,
          useClass: MockConfiguratorCommonsService,
        },
      ],
    }).compileComponents();
  }));

  it('should create', () => {
    configurationObs = of(productConfiguration);
    initialize(routerData);
    expect(component).toBeTruthy();
  });

  it('should display no banner when there are no issues', () => {
    configurationObs = of(productConfigurationWithoutIssues);
    initialize(routerData);
    CommonConfiguratorTestUtilsService.expectElementNotPresent(
      expect,
      htmlElem,
      'cx-icon'
    );
    CommonConfiguratorTestUtilsService.expectElementNotPresent(
      expect,
      htmlElem,
      '.cx-error-msg'
    );
    CommonConfiguratorTestUtilsService.expectElementNotPresent(
      expect,
      htmlElem,
      '.cx-conflict-msg'
    );
  });

  it('should display banner when there are issues', () => {
    configurationObs = of(productConfigurationWithIssues);
    initialize(routerData);
    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      'cx-icon'
    );
    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      '.cx-error-msg'
    );
  });

  it('should display 2 banners when there are detailed issues counted', () => {
    configurationObs = of(
      productConfigurationWithDetailedIssuesCountedInOverview
    );
    initialize(routerData);
    CommonConfiguratorTestUtilsService.expectNumberOfElements(
      expect,
      htmlElem,
      'cx-icon',
      2
    );
    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      '.cx-error-msg'
    );
    CommonConfiguratorTestUtilsService.expectElementPresent(
      expect,
      htmlElem,
      '.cx-conflict-msg'
    );
  });

  it('should display no banner in order history when there are issues', () => {
    configurationObs = of(productConfiguration);
    initialize(orderRouterData);
    CommonConfiguratorTestUtilsService.expectElementNotPresent(
      expect,
      htmlElem,
      'cx-icon'
    );
    CommonConfiguratorTestUtilsService.expectElementNotPresent(
      expect,
      htmlElem,
      '.cx-error-msg'
    );
  });

  it('should count issues from configuration in case OV not available', () => {
    configurationObs = of(productConfigurationWithConflicts);
    initialize(routerData);
    component.numberOfIssues$.subscribe((numberOfIssues) =>
      expect(numberOfIssues).toBe(
        productConfigurationWithConflicts.totalNumberOfIssues
      )
    );
  });

  it('should count issues from OV in case OV is available', () => {
    configurationObs = of(
      productConfigurationWithOnlyTotalIssuesCountedInOverview
    );
    initialize(routerData);
    component.numberOfIssues$.subscribe((numberOfIssues) =>
      expect(numberOfIssues).toBe(
        productConfigurationWithOnlyTotalIssuesCountedInOverview.overview
          ?.totalNumberOfIssues
      )
    );
  });

  it('should count only missing mandatory fields as issues in case detailed issue numbers are available', () => {
    configurationObs = of(
      productConfigurationWithDetailedIssuesCountedInOverview
    );
    initialize(routerData);
    component.numberOfIssues$.subscribe((numberOfIssues) =>
      expect(numberOfIssues).toBe(
        productConfigurationWithDetailedIssuesCountedInOverview.overview
          ?.numberOfIncompleteCharacteristics
      )
    );
  });

  it('should count zero issues in case detailed issue numbers are available with only conflicts', () => {
    const config: Configurator.Configuration = structuredClone(
      productConfigurationWithDetailedIssuesCountedInOverview
    );
    if (config.overview) {
      config.overview.numberOfIncompleteCharacteristics = 0;
    }
    configurationObs = of(config);
    initialize(routerData);
    component.numberOfIssues$.subscribe((numberOfIssues) =>
      expect(numberOfIssues).toBe(0)
    );
  });

  it('should count only conflicts as warnings in case detailed issue numbers are available', () => {
    configurationObs = of(
      productConfigurationWithDetailedIssuesCountedInOverview
    );
    initialize(routerData);
    component.numberOfConflicts$.subscribe((numberOfConflicts) =>
      expect(numberOfConflicts).toBe(
        productConfigurationWithDetailedIssuesCountedInOverview.overview
          ?.numberOfConflicts
      )
    );
    component.skipConflictsOnIssueNavigation$.subscribe((skipConflicts) =>
      expect(skipConflicts).toBe(true)
    );
  });

  it('should count zero warnings as in case detailed issue numbers are not available', () => {
    configurationObs = of(
      productConfigurationWithOnlyTotalIssuesCountedInOverview
    );
    initialize(routerData);
    component.numberOfConflicts$.subscribe((numberOfConflicts) =>
      expect(numberOfConflicts).toBe(0)
    );
    component.skipConflictsOnIssueNavigation$.subscribe((skipConflicts) =>
      expect(skipConflicts).toBe(false)
    );
  });

  it('should count zero warnings as in case overview is not available', () => {
    configurationObs = of(productConfigurationWithConflicts);
    initialize(routerData);
    component.numberOfConflicts$.subscribe((numberOfConflicts) =>
      expect(numberOfConflicts).toBe(0)
    );
    component.skipConflictsOnIssueNavigation$.subscribe((skipConflicts) =>
      expect(skipConflicts).toBe(false)
    );
  });
});
