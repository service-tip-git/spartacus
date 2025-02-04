/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  convertAnnotatedSourceToFailureCase,
  RuleTester,
} from '@angular-eslint/test-utils';
import { rule, RULE_NAME } from './ngrx-fail-action-must-initialize-error';

const ruleTester = new RuleTester();

ruleTester.run(RULE_NAME, rule, {
  valid: [
    `
    export class SearchProductsFail implements ErrorAction {
        readonly type = SEARCH_PRODUCTS_FAIL;
        error = 'some error'; // Property initializer
    }
    `,
    `
    export class SearchProductsFail implements ErrorAction {
        readonly type = SEARCH_PRODUCTS_FAIL;
        constructor(public error: any) {} // Constructor parameter
    }
    `,
    `
    export class SearchProductsFail implements ErrorAction {
        readonly type = SEARCH_PRODUCTS_FAIL;
        error: any;
        constructor(public payload: any) {
            this.error = payload; // Constructor assignment
        }
    }
    `,
    `
    export class SearchProductsFail implements ErrorAction {
        readonly type = SEARCH_PRODUCTS_FAIL;
        error: any;
        constructor() {
            this.error = 'error'; // Constructor body assignment
        }
    }
    `,
    `
    export class SearchProductsFail {
        readonly type = SEARCH_PRODUCTS_FAIL;
      constructor(public payload: any) {}
    }
    `,
  ],
  invalid: [
    convertAnnotatedSourceToFailureCase({
      description: 'Error property declared but not initialized in constructor',
      annotatedSource: `
        export class SearchProductsFail implements ErrorAction {
                     ~~~~~~~~~~~~~~~~~~
          readonly type = SEARCH_PRODUCTS_FAIL;
          error: any;
          constructor(public payload: any) {}
        }
      `,
      messageId: 'missingErrorInitialization',
    }),
    convertAnnotatedSourceToFailureCase({
      description: 'Error property declared but not initialized at all',
      annotatedSource: `
        export class SearchProductsFail implements ErrorAction {
                     ~~~~~~~~~~~~~~~~~~
          readonly type = SEARCH_PRODUCTS_FAIL;
          error: any;
        }
      `,
      messageId: 'missingErrorInitialization',
    }),
  ],
});
