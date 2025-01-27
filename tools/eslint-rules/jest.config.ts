/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable */
export default {
  displayName: 'eslint-rules',
  preset: './jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  testEnvironment: './environments/fix-jsdom-environment.ts',
  moduleFileExtensions: ['ts', 'js', 'html'],
};
