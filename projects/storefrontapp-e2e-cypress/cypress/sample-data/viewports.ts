/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

// We use Bootstrap default viewports for small screens
// getbootstrap.com/docs/4.0/layout/overview/#responsive-breakpoints
export const formats = {
  mobile: {
    width: 575,
    height: 640,
  },
  desktop: {
    width: 1000,
    height: 660,
  },
};

export enum ViewportType {
  Mobile = 'mobile',
  Desktop = 'desktop',
}
