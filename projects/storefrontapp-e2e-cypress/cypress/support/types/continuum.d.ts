declare global {
  namespace Cypress {
    interface Chainable {
      a11yContinuumSetup(configPath: string): Chainable<void>;
      a11yContinuumRunAllTests(includeIframe?: boolean): Chainable<void>;
      a11YContinuumPrintResults(): Chainable<void>;
      a11yContinuumSubmitConcernsToAmp(reportName?: string): Chainable<void>;
      a11YContinuumFailIfConcerns(): Chainable<void>;
    }
  }

  interface Window {
    LevelAccess_Continuum_AccessEngine: any;
    LevelAccess_AccessContinuumConfiguration: any;
  }
}

export {};
