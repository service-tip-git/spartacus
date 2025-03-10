/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Config } from '@spartacus/core';
import { ExportConfig } from '../model/export-entries.model';
import { ImportConfig } from '../model/import-entries.config';

@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class ImportExportConfig {
  cartImportExport?: {
    file: { separator: string };
    import?: ImportConfig;
    export: ExportConfig;
  };
}

declare module '@spartacus/core' {
  interface Config extends ImportExportConfig {}
}
