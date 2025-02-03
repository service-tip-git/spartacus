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
      description:
        'Fail action has no error property initialization in constructor',
      annotatedSource: `
        export class SearchProductsFail implements ErrorAction {
                     ~~~~~~~~~~~~~~~~~~
          readonly type = SEARCH_PRODUCTS_FAIL;
          constructor(public payload: any) {}
        }
      `,
      messageId: 'missingErrorProperty',
    }),

    convertAnnotatedSourceToFailureCase({
      description:
        'Fail action has error property declared but not initialized',
      annotatedSource: `
        export class SearchProductsFail implements ErrorAction {
                     ~~~~~~~~~~~~~~~~~~
          readonly type = SEARCH_PRODUCTS_FAIL;
          error: any; // Only declared but not initialized
        }
      `,
      messageId: 'missingErrorProperty',
    }),

    convertAnnotatedSourceToFailureCase({
      description: 'Fail action has no error property at all',
      annotatedSource: `
        export class SearchProductsFail implements ErrorAction {
                     ~~~~~~~~~~~~~~~~~~
          readonly type = SEARCH_PRODUCTS_FAIL;
        }
      `,
      messageId: 'missingErrorProperty',
    }),
  ],
});
