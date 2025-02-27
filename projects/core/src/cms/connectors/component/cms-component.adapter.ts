/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Observable } from 'rxjs';
import { CmsComponent } from '../../../model/cms.model';
import { PageContext } from '../../../routing/models/page-context.model';

export abstract class CmsComponentAdapter {
  /**
   * Abstract method must be used to load the component for a given `id` and `PageContext`.
   * The component can be loaded from alternative backend, as long as the structure
   * converts to the `CmsStructureModel`.
   *
   * @param pageContext The `PageContext` holding the page Id.
   */
  abstract load<T extends CmsComponent>(
    id: string,
    pageContext: PageContext,
    fields?: string
  ): Observable<T>;

  /**
   * Abstract method to get components by list of ids.
   *
   * @param ids
   * @param pageContext
   */
  abstract findComponentsByIds(
    ids: string[],
    pageContext: PageContext
  ): Observable<CmsComponent[]>;
}
