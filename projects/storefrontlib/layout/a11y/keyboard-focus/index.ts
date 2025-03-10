/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

// given that we're likely going to refactor the directives, we're
// NOT exposing all it to the public API.
export * from './focus.directive';
export { FocusConfig, TrapFocus, TrapFocusType } from './keyboard-focus.model';
export * from './skip-focus.directive';
export * from './keyboard-focus.module';
export * from './focus-testing.module';
export * from './services/index';
export * from './keyboard-focus.utils';

// export * from './autofocus/index';
// export * from './base/index';
// export * from './block/index';
// export * from './escape/index';
// export * from './lock/index';
// export * from './on-navigate/index';
// export * from './persist/index';
// export * from './tab/index';
// export * from './trap/index';
// export * from './visible/index';
// export * from './keyboard-focus.model';
