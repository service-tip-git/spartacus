/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cxMultiLine',
  standalone: false,
})
export class MultiLinePipe implements PipeTransform {
  transform(value: string): string {
    const lastIndex = value.lastIndexOf(' ');

    if (lastIndex === -1) {
      return value;
    }

    return (
      value.substring(0, lastIndex) +
      '<br />' +
      value.substring(lastIndex, value.length).trim()
    );
  }
}
