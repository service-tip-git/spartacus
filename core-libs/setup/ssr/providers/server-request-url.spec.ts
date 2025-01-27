/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */
jest.mock('@angular/core', () => {
  return {
    ...jest.requireActual('@angular/core'),
    inject: jest.fn(),
  };
});

import { inject } from '@angular/core';
import { INITIAL_CONFIG } from '@angular/platform-server';
import { SERVER_REQUEST_ORIGIN, SERVER_REQUEST_URL } from '@spartacus/core';
import { serverRequestUrlFactory } from './server-request-url';

describe('serverRequestUrlFactory', () => {
  describe('when SERVER_REQUEST_URL is present', () => {
    it('should return SERVER_REQUEST_URL', () => {
      const mockOrigin = 'https://express.origin.com';
      (inject as jest.Mock).mockImplementation((token) => {
        if (token.toString() === SERVER_REQUEST_URL.toString()) {
          return mockOrigin;
        }
      });

      const result = serverRequestUrlFactory()();
      expect(result).toEqual(mockOrigin);
    });
  });
  describe('when SERVER_REQUEST_URL is NOT present', () => {
    it('should use SERVER_REQUEST_ORIGIN and INITIAL_CONFIG to build the url', () => {
      const mockOrigin = 'https://express.origin.com';
      const mockUrl = '/home';

      (inject as jest.Mock).mockImplementation((token) => {
        if (token.toString() === SERVER_REQUEST_ORIGIN.toString()) {
          return mockOrigin;
        }
        if (token.toString() === INITIAL_CONFIG.toString()) {
          return {
            url: mockUrl,
          };
        }
      });

      const result = serverRequestUrlFactory()();
      expect(result).toEqual(mockOrigin + mockUrl);
    });
  });
});
