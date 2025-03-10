/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { createSelector, MemoizedSelector } from '@ngrx/store';
import { BaseSite } from '../../../model/misc.model';
import {
  BaseSiteEntities,
  BaseSiteState,
  SiteContextState,
  StateWithSiteContext,
} from '../state';
import { getSiteContextState } from './site-context.selector';

const sitesEntitiesSelector = (state: BaseSiteState) => state.entities;

export const getBaseSiteState: MemoizedSelector<
  StateWithSiteContext,
  BaseSiteState
> = createSelector(
  getSiteContextState,
  (state: SiteContextState) => state.baseSite
);

export const getActiveBaseSite: MemoizedSelector<StateWithSiteContext, string> =
  createSelector(
    getSiteContextState,
    (state: SiteContextState) =>
      state && state.baseSite && state.baseSite.activeSite
  );

export const getBaseSiteData: MemoizedSelector<StateWithSiteContext, BaseSite> =
  createSelector(
    getSiteContextState,
    (state: SiteContextState) =>
      state && state.baseSite && state.baseSite.details
  );

export const getBaseSitesEntities: MemoizedSelector<
  StateWithSiteContext,
  BaseSiteEntities | null
> = createSelector(getBaseSiteState, sitesEntitiesSelector);

export const getAllBaseSites: MemoizedSelector<
  StateWithSiteContext,
  BaseSite[] | null
> = createSelector(getBaseSitesEntities, (entities) => {
  return entities ? Object.keys(entities).map((uid) => entities[uid]) : null;
});
