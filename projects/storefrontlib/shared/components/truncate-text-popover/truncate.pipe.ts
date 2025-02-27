/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pipe, PipeTransform } from '@angular/core';

const defaultLimit = 20;

@Pipe({
  name: 'cxTruncate',
  standalone: false,
})
export class TruncatePipe implements PipeTransform {
  /**
   * example usage {{ exampleString | cxTruncate: [1, ''] }}
   */
  transform(value: string, args?: [number, string?]): string {
    if (!args) {
      return value;
    }

    let trail = '...';

    const limit =
      args.length > 0 && args[0] && Number.isInteger(+args[0])
        ? args[0]
        : defaultLimit;

    if (args.length > 1 && args[1] !== undefined) {
      trail = args[1];
    }

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
