/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

window.LevelAccess_AccessContinuumConfiguration = {
  accessEngineType: 'professional',
  ampInstanceUrl: 'https://sap.levelaccess.net',
  defaultStandardIds: [
    610 /* WCAG 2.0 Level A */, 611 /* WCAG 2.0 Level AA */,
    612 /* WCAG 2.0 Level AAA */, 1387 /* WCAG 2.1 Level A */,
    1388 /* WCAG 2.1 Level AA */, 1389 /* WCAG 2.1 Level AAA */,
    1140 /* Section 508 and 255 (Revised 2017) */,
    1471 /* WCAG 2.0 Level A & AA Baseline */, 1001235 /* WCAG SAP Standards */,
    2127 /* WCAG 2.2 Level A */, 2128 /* WCAG 2.2 Level AA */,
  ],
  includePotentialAccessibilityConcerns: false,
  ampApiToken: Cypress.env('AMP_API_TOKEN'),
  proxy: {
    host: null,
    port: null,
    username: null,
    password: null,
  },
  accessibilityConcerns: {
    includePotentialConcerns: false,
    format: 'amp',
  },
  levelAccessPlatform: {
    orgInstanceUrl: null,
    apiKey: null,
    workspaceId: null,
    digitalPropertyId: null,
    scanTagId: null,
  },
};
