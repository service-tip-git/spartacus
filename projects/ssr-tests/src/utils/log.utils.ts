/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Contains methods pertaining to reading, writing and asserting of the ssr log
 * generated by a running ssr server for the sake of testing ssr.
 */

import * as fs from 'fs';
import { inspect } from 'util';

/**
 * Path where SSR log file from server will be generated and read from.
 */
const SSR_LOG_PATH = './.ssr.log';

/**
 * Writes no characters to log to clear log file.
 */
export function clearSsrLogFile(): void {
  fs.writeFileSync(SSR_LOG_PATH, '');
}

/**
 * Returns raw logs as an array of strings.
 *
 * Note: Non-JSON log entries are also included in the returned array.
 */
export function getRawLogs(): string[] {
  const data = fs.readFileSync(SSR_LOG_PATH).toString();
  return data.toString().split('\n');
}

/**
 * Returns raw logs as an array of strings, with JSON objects pretty-printed.
 *
 * Note: Non-JSON log entries are also included in the returned array.
 */
export function getRawLogsPretty(): string[] {
  return getRawLogs().map((line) => {
    try {
      const object = JSON.parse(line);
      return inspect(object, { depth: null });
    } catch (_e) {
      // If the line is not a valid JSON, return it as a string
      return line;
    }
  });
}

/**
 * Returns logs as an array of objects, parsed from JSON log entries.
 *
 * Note: Non-JSON log entries are skipped (e.g. 'Node is running on port 4000').
 */
export function getLogsObjects(): object[] {
  return getRawLogs()
    .map((log) => {
      try {
        return JSON.parse(log);
      } catch (_e) {
        return undefined;
      }
    })
    .filter((x): x is object => x !== undefined);
}

/**
 * Returns logs as an array of strings, being the `message` field of each parsed JSON log entry.
 *
 * Note: Non-JSON log entries are skipped (e.g. 'Node is running on port 4000').
 */
export function getLogsMessages(): string[] {
  return getLogsObjects().map((log) => {
    return (log as { message: string }).message;
  });
}

/**
 * Check log every interval to see if log contains text.
 * Keeps waiting until log contains text or test times out.
 */
export async function waitUntilLogContainsText(
  text: string,
  checkInterval = 500
): Promise<true> {
  return new Promise((resolve) => {
    if (getRawLogs().some((log) => log.includes(text))) {
      return resolve(true);
    }
    return setTimeout(
      () => resolve(waitUntilLogContainsText(text)),
      checkInterval
    );
  });
}
