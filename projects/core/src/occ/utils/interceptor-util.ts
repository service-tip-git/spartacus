/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpHeaders, HttpRequest } from '@angular/common/http';

export const USE_CLIENT_TOKEN = 'cx-use-client-token';
export const USE_CUSTOMER_SUPPORT_AGENT_TOKEN = 'cx-use-csagent-token';
export const USE_CAPTCHA_TOKEN = 'sap-commerce-cloud-captcha-token';

export class InterceptorUtil {
  static createHeader<T>(
    headerName: string,
    interceptorParam: T,
    headers?: HttpHeaders
  ): HttpHeaders {
    if (headers) {
      return headers.append(headerName, JSON.stringify(interceptorParam));
    }
    headers = new HttpHeaders().set(
      headerName,
      JSON.stringify(interceptorParam)
    );
    return headers;
  }

  static removeHeader(
    headerName: string,
    request: HttpRequest<any>
  ): HttpRequest<any> {
    const updatedHeaders = request.headers.delete(headerName);
    return request.clone({ headers: updatedHeaders });
  }

  static getInterceptorParam<T>(
    headerName: string,
    headers: HttpHeaders
  ): T | undefined {
    const rawValue = headers.get(headerName);
    if (rawValue) {
      return JSON.parse(rawValue);
    }
    return undefined;
  }
}
