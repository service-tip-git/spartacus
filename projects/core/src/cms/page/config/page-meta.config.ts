/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { Config } from '../../../config/config-tokens';

@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class PageMetaConfig {
  pageMeta?: PageMetaResolversConfig;
}

declare module '../../../config/config-tokens' {
  interface Config extends PageMetaConfig {}
}

export interface PageMetaResolversConfig {
  resolvers?: PageMetaResolverConfig[];

  /**
   * Specifies how the canonical url is created.
   */
  canonicalUrl?: CanonicalUrlOptions;

  /**
   * Enables resolvers in dev mode regardless of the CSR configuration. This
   * flag will override the disabling in CSR, which can be useful during development
   * and debugging.
   */
  enableInDevMode?: boolean;
}

export interface PageMetaResolverConfig {
  /**
   * PageMeta property
   */
  property: string;

  /**
   * The resolver method that must be provided on the resolver class.
   */
  method: string;

  /**
   * Disables specific resolvers in CSR mode.
   *
   * @deprecated since 2211.31 - this option will be removed in the future together
   *              with the feature toggle `allPageMetaResolversEnabledInCsr`
   *              (then all resolvers will be enabled in CSR).
   */
  disabledInCsr?: boolean;
}

export interface CanonicalUrlOptions {
  /**
   * Forces a trailing slash to avoid both https://www.myshop.com and https://www.myshop.com/.
   */
  forceTrailingSlash?: boolean;

  /**
   * Forces the use of `https://` in the canonical URL.
   */
  forceHttps?: boolean;

  /**
   * Forces the `www` subdomain, so that canonical URLs are always prefixed with `www.`.
   *
   * Please be aware that the logic will not detect whether your domain includes a subdomain.
   */
  forceWww?: boolean;

  /**
   * Removes query parameters from the URL to avoid page duplicates.
   *
   * This is useful in case page urls have various query parameters that are added by
   * integrations (i.e. generated links from social platform).
   *
   * The query parameter can either be removed completely, or an array of query parameter keys
   * can be provided.
   */
  removeQueryParams?: boolean | string[];
}
