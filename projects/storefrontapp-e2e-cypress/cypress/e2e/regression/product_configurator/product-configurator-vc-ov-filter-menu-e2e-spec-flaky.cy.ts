import * as configuration from '../../../helpers/product-configurator';
import * as configurationVc from '../../../helpers/product-configurator-vc';
import * as configurationOverview from '../../../helpers/product-configurator-overview';
import * as configurationOverviewVc from '../../../helpers/product-configurator-overview-vc';
import { clickAllowAllFromBanner } from '../../../helpers/anonymous-consents';

const electronicsShop = 'electronics-spa';
const testProduct = 'CONF_CAMERA_SL';

const RB = 'radioGroup';
const CBL = 'checkBoxList';

const GROUP_ID_OPTIONS = '5';
const GROUP_ID_LENS = '4';

context('Product Configuration', () => {
  beforeEach(() => {
    cy.visit('/');
    configurationOverviewVc.registerConfigurationOverviewRoute();
    configurationOverviewVc.registerConfigurationOverviewUpdateRoute();
  });

  it('should display sidebar with filter and menu on overview page', () => {
    clickAllowAllFromBanner();

    configurationOverviewVc.goToConfigOverviewPage(
      electronicsShop,
      testProduct
    );
    configurationOverviewVc.checkSidebarDisplayed();
    configurationOverviewVc.checkMenuDisplayed();

    configurationOverviewVc.toggleSidebar();
    configurationOverviewVc.checkFilterDisplayed();

    configurationOverviewVc.toggleSidebar();
    configurationOverviewVc.checkMenuDisplayed();
  });

  it('should be able filter the overview page', () => {
    cy.viewport(1000, 660);
    clickAllowAllFromBanner();
    completeDigitalCameraConfiguration();
    configuration.navigateToOverviewPage();

    // no filter
    configurationOverviewVc.checkNumberOfMenuEntriesDisplayed(5);
    configurationOverview.checkNumberOfGroupHeadersDisplayed(5);
    configurationOverview.checkNumberOfAttributesDisplayed(17);
    configurationOverview.checkNumberOfAttributePricesDisplayed(4);

    // filter prices relevant
    configurationOverviewVc.toggleSidebar();
    configurationOverviewVc.toggleAttributeFilterAndWait('price');
    configurationOverviewVc.toggleSidebar();
    configurationOverviewVc.checkNumberOfMenuEntriesDisplayed(3);
    configurationOverview.checkNumberOfGroupHeadersDisplayed(3);
    configurationOverview.checkNumberOfAttributesDisplayed(4);
    configurationOverview.checkNumberOfAttributePricesDisplayed(4);

    // filter prices relevant and group Options
    configurationOverviewVc.toggleSidebar();
    configurationOverviewVc.toggleGroupFilterAndWait(GROUP_ID_OPTIONS);
    configurationOverview.checkNumberOfGroupHeadersDisplayed(1);
    configurationOverview.checkNumberOfAttributesDisplayed(2);
    configurationOverview.checkNumberOfAttributePricesDisplayed(2);
    configurationOverviewVc.toggleSidebar();
    configurationOverviewVc.checkNumberOfMenuEntriesDisplayed(1);

    // filter prices relevant and (group Options or group Lens)
    configurationOverviewVc.toggleSidebar();
    configurationOverviewVc.toggleGroupFilterAndWait(GROUP_ID_LENS);
    configurationOverviewVc.toggleSidebar();
    configurationOverviewVc.checkNumberOfMenuEntriesDisplayed(2);
    configurationOverview.checkNumberOfGroupHeadersDisplayed(2);
    configurationOverview.checkNumberOfAttributesDisplayed(3);
    configurationOverview.checkNumberOfAttributePricesDisplayed(3);

    // group Options or group Lens
    configurationOverviewVc.toggleSidebar();
    configurationOverviewVc.removeFilterByNameAndWait('Price');
    configurationOverview.checkNumberOfGroupHeadersDisplayed(2);
    configurationOverview.checkNumberOfAttributesDisplayed(4);
    configurationOverview.checkNumberOfAttributePricesDisplayed(3);
    configurationOverviewVc.toggleSidebar();
    configurationOverviewVc.checkNumberOfMenuEntriesDisplayed(2);

    // no filter
    configurationOverviewVc.toggleSidebar();
    configurationOverviewVc.removeFilterByNameAndWait('Remove All');
    configurationOverview.checkNumberOfGroupHeadersDisplayed(5);
    configurationOverview.checkNumberOfAttributesDisplayed(17);
    configurationOverview.checkNumberOfAttributePricesDisplayed(4);
    configurationOverviewVc.toggleSidebar();
    configurationOverviewVc.checkNumberOfMenuEntriesDisplayed(5);

    // menu scroll test
    for (let ii: number = 0; ii < 5; ii++) {
      configurationOverviewVc.clickMenuItem(ii);
      configurationOverviewVc.checkViewPortScrolledToGroup(ii);
    }
  });
});

function completeDigitalCameraConfiguration() {
  const commerceRelease: configurationVc.CommerceRelease = {};
  const configVc = configurationVc;
  configVc.registerConfigurationRoute();
  configVc.registerConfigurationUpdateRoute();
  configVc.checkCommerceRelease(electronicsShop, testProduct, commerceRelease);
  const pricing = commerceRelease.isPricingEnabled;
  if (pricing) {
    configVc.registerConfigurationPricingRoute();
  }
  configVc.goToConfigurationPage(electronicsShop, testProduct);
  configVc.selectAttributeAndWait('CAMERA_MODE', RB, 'P', pricing);
  configVc.selectAttributeAndWait('CAMERA_COLOR', RB, 'BLACK', pricing);

  configVc.clickOnNextBtnAndWait('Specification', pricing);
  configVc.selectAttributeAndWait('CAMERA_PIXELS', RB, 'P16', pricing);
  configVc.selectAttributeAndWait('CAMERA_SENSOR', RB, 'F', pricing);
  configVc.selectAttributeAndWait('CAMERA_VIEWFINDER', RB, 'R', pricing);
  configVc.selectAttributeAndWait('CAMERA_SD_CARD', CBL, 'SDHC', pricing);
  configVc.selectAttributeAndWait('CAMERA_SD_CARD', CBL, 'SDXC', pricing);
  configVc.selectAttributeAndWait('CAMERA_SECOND_SLOT', RB, 'Y', pricing);
  configVc.selectAttributeAndWait('CAMERA_FORMAT_PICTURES', RB, 'RAW', pricing);
  configVc.selectAttributeAndWait('CAMERA_MAX_ISO', RB, '25600', pricing);

  configVc.clickOnNextBtnAndWait('Display', pricing);
  configVc.selectAttributeAndWait('CAMERA_DISPLAY', RB, 'P10', pricing);
  configVc.selectAttributeAndWait('CAMERA_TOUCHSCREEN', RB, 'Y', pricing);
  configVc.selectAttributeAndWait('CAMERA_TILTABLE', RB, 'Y', pricing);

  configVc.clickOnNextBtnAndWait('Lens', pricing);
  const CAM_LENS_MANU = 'CAMERA_LENS_MANUFACTURER';
  configVc.selectAttributeAndWait(CAM_LENS_MANU, RB, 'LEICA', pricing);
  const ST_24_79 = 'STANDARD_ZOOM_24_70';
  configVc.selectAttributeAndWait('CAMERA_LENS_TYPE', RB, ST_24_79, pricing);

  configVc.clickOnNextBtnAndWait('Options', pricing);
  configVc.selectAttributeAndWait('CAMERA_OPTIONS', CBL, 'W', pricing);
  configVc.selectAttributeAndWait('CAMERA_OPTIONS', CBL, 'I', pricing);
}
