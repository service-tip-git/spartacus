/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTimer',
  standalone: false,
})
export class FormatTimerPipe implements PipeTransform {
  transform(totalSeconds: number): string {
    if (totalSeconds < 0) {
      totalSeconds = 0;
    }
    const minutes: number = Math.floor(totalSeconds / 60);
    const seconds: number = totalSeconds % 60;
    let zeroPaddedMinutes: string;
    if (minutes < 10) {
      zeroPaddedMinutes = ('00' + minutes).slice(-2);
    } else {
      zeroPaddedMinutes = minutes + '';
    }
    const zeroPaddedSeconds: string = ('00' + seconds).slice(-2);
    return `${zeroPaddedMinutes}:${zeroPaddedSeconds}`;
  }
}
