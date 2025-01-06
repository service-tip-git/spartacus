/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RegistrationVerificationTokenCreation {
  purpose: string;
  loginId: string;
}

export interface RegistrationVerificationToken {
  expiresIn: string;
  tokenId: string;
}

export enum Registration_VERIFICATION_TOKEN_DIALOG_ACTION {
  OK = 'OK',
}
