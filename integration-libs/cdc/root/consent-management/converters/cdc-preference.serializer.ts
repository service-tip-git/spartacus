/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { CdcConsentWithStatus } from '../model';

@Injectable({ providedIn: 'root' })
export class CdcPreferenceSerializer
  implements Converter<CdcConsentWithStatus[], any>
{
  /**
   * Generate CDC preferences from consent objects
   * @param cdcConsents List of consents with their statuses
   * @returns Serialized and deeply nested preferences object
   */
  convert(source: CdcConsentWithStatus[], _target?: any): any {
    return source.reduce((preferences: any, cdcConsent) => {
      if (!cdcConsent.id) {
        return preferences;
      }
      const path = `${cdcConsent.id}.isConsentGranted`;
      const value = cdcConsent.isConsentGranted === true;
      const serializedPreference = this.convertToCdcPreference(path, value);
      return this.deepMerge(preferences, serializedPreference);
    }, {});
  }

  /**
   * Converts a dot-separated string to a deeply nested object.
   * @param path Dot-separated string representing keys
   * @param value Value to set
   * @returns Nested object
   */
  private convertToCdcPreference(path: string, value: any): any {
    return path.split('.').reduceRight((acc, key) => ({ [key]: acc }), value);
  }

  /**
   * Merges two objects into one.
   */
  private deepMerge(target: any, source: any): any {
    for (const key of Object.keys(source)) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        target[key] = this.deepMerge(target[key] ?? {}, source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }
}
