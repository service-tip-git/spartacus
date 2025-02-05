/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { RuleTester } from '@angular-eslint/test-utils';
import { join } from 'path';
import { rule, RULE_NAME } from './ngrx-fail-action-must-initialize-error';

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      project: '../../tsconfig.spec.json',
      tsconfigRootDir: join(__dirname, '/fixtures'),
    },
  },
});

ruleTester.run(RULE_NAME, rule, {
  valid: [
    {
      name: 'Property initializer',
      code: `
        export interface ErrorAction {
          error: Object;
        }

        export class SearchProductsFail implements ErrorAction {
            readonly type = SEARCH_PRODUCTS_FAIL;
            error = 'some error'; // Property initializer
        }
      `,
      filename: 'file.ts',
    },
    {
      name: 'Constructor parameter',
      code: `
        export interface ErrorAction {
          error: Object;
        }

        export class SearchProductsFail implements ErrorAction {
            readonly type = SEARCH_PRODUCTS_FAIL;
            constructor(public error: any) {} // Constructor parameter
        }
      `,
      filename: 'file.ts',
    },
    {
      name: 'Constructor assignment',
      code: `
        export interface ErrorAction {
          error: Object;
        }

        export class SearchProductsFail implements ErrorAction {
            readonly type = SEARCH_PRODUCTS_FAIL;
            error: Object;
            constructor(public payload: any) {
                this.error = payload; // Constructor assignment
            }
        }
      `,
      filename: 'file.ts',
    },
    {
      name: 'Constructor body assignment',
      code: `
        export interface ErrorAction {
          error: Object;
        }

        export class SearchProductsFail implements ErrorAction {
            readonly type = SEARCH_PRODUCTS_FAIL;
            error: any;
            constructor() {
                this.error = 'error'; // Constructor body assignment
            }
        }
      `,
      filename: 'file.ts',
    },
    {
      name: 'Class not implementing ErrorAction',
      code: `
        export interface ErrorAction {
          error: Object;
        }

        export class SearchProductsFail {
            readonly type = SEARCH_PRODUCTS_FAIL;
          constructor(public payload: any) {}
        }
      `,
      filename: 'file.ts',
    },
    {
      name: 'Class with Fail but not implementing ErrorAction',
      code: `
        export class LoadProductsFail {
            readonly type = LOAD_PRODUCTS_FAIL;
            constructor(public payload: Error) {}
        }
      `,
      filename: 'file.ts',
    },
    {
      name: 'Multiple interfaces implementation',
      code: `
        export interface ErrorAction { 
          error: Object; 
        }
        
        export interface PayloadAction { 
          payload: any; 
        }
        
        export class ComplexFail implements ErrorAction, PayloadAction {
          readonly type = COMPLEX_FAIL;
          constructor(public payload: any) {
            this.error = payload;
          }
        }
      `,
      filename: 'file.ts',
    },
    {
      name: 'Inheritance case',
      code: `
        export interface ErrorAction { error: Object; }
        export class BaseFailAction implements ErrorAction {
          error = new Error();
        }
        export class DerivedFail extends BaseFailAction {
          readonly type = DERIVED_FAIL;
        }
      `,
      filename: 'file.ts',
    },
  ],
  invalid: [
    {
      name: 'Missing error initialization in class',
      code: `
        export interface ErrorAction {
          error: Object;
        }

        export class SearchProductsFail implements ErrorAction {
          readonly type = SEARCH_PRODUCTS_FAIL;
          error: Object;
          constructor(public payload: any) {}
        }
      `,
      errors: [
        { messageId: 'missingErrorInitialization', line: 6, column: 22 },
      ],
      filename: 'file.ts',
    },
    {
      name: 'Missing error initialization in class',
      code: `
        export interface ErrorAction {
          error: Object;
        }

        export class SearchProductsFail implements ErrorAction {
          readonly type = SEARCH_PRODUCTS_FAIL;
          error: Object;
        }
      `,
      errors: [
        { messageId: 'missingErrorInitialization', line: 6, column: 22 },
      ],
      filename: 'file.ts',
    },
    {
      name: 'Missing error initialization in inherited class',
      code: `
        export interface ErrorAction { 
          error: Object; 
        }
        
        export class BaseFailAction implements ErrorAction {
          error: Error;
        }
       
        export class DerivedFail extends BaseFailAction {
          readonly type = DERIVED_FAIL;
        }
      `,
      errors: [
        { messageId: 'missingErrorInitialization', line: 6, column: 22 }, // BaseFailAction
        { messageId: 'missingErrorInitialization', line: 10, column: 22 }, // DerivedFail
      ],
      filename: 'file.ts',
    },
    {
      name: 'Multiple interfaces with uninitialized error',
      code: `
        export interface ErrorAction { 
          error: Object;
        }
        
        export interface PayloadAction { 
          payload: any; 
        }
        
        export class ComplexFail implements ErrorAction, PayloadAction {
          readonly type = COMPLEX_FAIL;
          payload = {};
          error: Object;
        }
      `,
      errors: [
        { messageId: 'missingErrorInitialization', line: 10, column: 22 }, // ComplexFail
      ],
      filename: 'file.ts',
    },
    {
      name: 'Typed error property without initialization',
      code: `
        export interface ErrorAction { 
          error: Object;
        }
        
        export class TypedFail implements ErrorAction {
          readonly type = TYPED_FAIL;
          error: Object;
        }
      `,
      errors: [
        { messageId: 'missingErrorInitialization', line: 6, column: 22 },
      ],
      filename: 'file.ts',
    },
  ],
});
