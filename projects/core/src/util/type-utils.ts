/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export type RequiredPick<T extends object, K extends keyof T = keyof T> = Omit<
  T,
  K
> &
  Required<Pick<T, K>>;
