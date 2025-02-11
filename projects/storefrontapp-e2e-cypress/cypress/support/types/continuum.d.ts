declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Sets up the Continuum JavaScript SDK by loading required files:
       * - Continuum configuration file (continuum.conf.js)
       * - Access Engine (AccessEngine.professional.js)
       *
       * @param configPath - Path to the Continuum configuration file
       */
      a11yContinuumSetup(configPath: string): Chainable<void>;

      /**
       * Verifies Access Engine is loaded and runs all accessibility tests.
       * Will load Access Engine if not already loaded.
       *
       * @param includeIframe - Whether to include iframes in the accessibility tests (default: false)
       */
      a11yContinuumRunAllTests(includeIframe?: boolean): Chainable<void>;

      /**
       * Prints accessibility test results to the Cypress log.
       * For each accessibility concern found:
       * - Highlights the offending element with a magenta border
       * - Logs the concern details and best practice URL
       * If no concerns are found, logs a success message.
       */
      a11YContinuumPrintResults(): Chainable<void>;

      /**
       * Submits accessibility concerns to AMP (Accessibility Management Platform).
       * Requires AMP_API_TOKEN, AMP_ORG_ID, and AMP_ASSET_ID environment variables to be set.
       *
       * @param reportName - Name of the report in AMP (default: 'AMP Report')
       */
      a11yContinuumSubmitConcernsToAmp(reportName?: string): Chainable<void>;

      /**
       * Fails the test if any accessibility concerns are found.
       * Uses Cypress expect assertion to check if the number of concerns is 0.
       */
      a11YContinuumFailIfConcerns(): Chainable<void>;
    }
  }

  interface Window {
    LevelAccess_Continuum_AccessEngine: any;
    LevelAccess_AccessContinuumConfiguration: any;
  }
}

export {};
