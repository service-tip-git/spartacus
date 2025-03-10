/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { EntityState } from '../entity/entity-state';
import { LoaderState } from '../loader/loader-state';

export type EntityLoaderState<T> = EntityState<LoaderState<T>>;
