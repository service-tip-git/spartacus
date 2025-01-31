/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { OccConfig } from '../../occ/config/occ-config';

export const defaultBackendHttpTimeoutConfig: OccConfig = {
  backend: {
    timeout: {
      server: 20_000,
    },
  },
};
