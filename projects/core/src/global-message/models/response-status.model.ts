/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

export enum HttpResponseStatus {
  UNKNOWN = -1,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  BAD_GATEWAY = 502,
  GATEWAY_TIMEOUT = 504,
  INTERNAL_SERVER_ERROR = 500,
}
