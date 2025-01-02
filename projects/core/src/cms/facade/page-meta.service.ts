/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { isPlatformBrowser } from '@angular/common';
import {
  inject,
  Inject,
  Injectable,
  isDevMode,
  PLATFORM_ID,
} from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { UnifiedInjector } from '../../lazy-loading/unified-injector';
import { resolveApplicable } from '../../util/applicable';
import { uniteLatest } from '../../util/rxjs/unite-latest';
import { Page, PageMeta } from '../model/page.model';
import { PageMetaConfig } from '../page/config/page-meta.config';
import { PageMetaResolver } from '../page/page-meta.resolver';
import { CmsService } from './cms.service';
import { FeatureConfigService } from '../../features-config';

/**
 * Service that collects the page meta data by using injected page resolvers.
 */
@Injectable({
  providedIn: 'root',
})
export class PageMetaService {
  private featureConfigService = inject(FeatureConfigService);

  constructor(
    protected cms: CmsService,
    protected unifiedInjector: UnifiedInjector,
    protected pageMetaConfig: PageMetaConfig,
    @Inject(PLATFORM_ID) protected platformId: string
  ) {}

  protected resolvers$: Observable<PageMetaResolver[]> = this.unifiedInjector
    .getMulti(PageMetaResolver)
    .pipe(shareReplay({ bufferSize: 1, refCount: true })) as Observable<
    PageMetaResolver[]
  >;

  protected meta$: Observable<PageMeta | null> = defer(() =>
    this.cms.getCurrentPage()
  ).pipe(
    filter((page) => Boolean(page)),
    switchMap((page: Page) => this.getMetaResolver(page)),
    switchMap((metaResolver: PageMetaResolver | undefined) =>
      metaResolver ? this.resolve(metaResolver) : of(null)
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  /**
   * Returns the observed page meta data for the current page.
   *
   * The data is resolved by various PageResolvers, which are configurable.
   */
  getMeta(): Observable<PageMeta | null> {
    return this.meta$;
  }

  /**
   * If a `PageResolver` has implemented a resolver interface, the resolved data
   * is merged into the `PageMeta` object.
   * @param metaResolver
   */
  protected resolve(metaResolver: PageMetaResolver): Observable<PageMeta> {
    const resolverMethods = this.getResolverMethods();
    const resolvedData: Observable<PageMeta>[] = Object.keys(resolverMethods)
      // TODO: Revisit if typing is possible here with Template Literal Types when we update to TS >=4.1
      .filter((key) => (metaResolver as any)[resolverMethods[key]])
      .map((key) => {
        return (metaResolver as any)
          [resolverMethods[key]]()
          .pipe(map((data) => ({ [key]: data })));
      });

    if (resolvedData.length === 0) {
      // uniteLatest will fail otherwise
      return of({});
    } else {
      return uniteLatest(resolvedData).pipe(
        map((data) => Object.assign({}, ...data))
      );
    }
  }

  /**
   * Returns an object with resolvers. The object properties represent the `PageMeta` property, i.e.:
   *
   * ```
   * {
   *   title: 'resolveTitle',
   *   robots: 'resolveRobots'
   * }
   * ```
   *
   * This list of resolvers is filtered for CSR vs SSR processing since not all resolvers are
   * relevant during browsing.
   */
  protected getResolverMethods(): { [property: string]: string } {
    const resolverMethods: Record<string, string> = {};
    // filter the resolvers to avoid unnecessary processing in CSR
    this.pageMetaConfig?.pageMeta?.resolvers
      ?.filter((resolver) => {
        const disabledInCsr = this.featureConfigService.isEnabled(
          'allPageMetaResolversEnabledInCsr'
        )
          ? false
          : resolver.disabledInCsr;
        return (
          // always resolve in SSR
          !isPlatformBrowser(this.platformId ?? '') ||
          // resolve in CSR when it's not disabled
          !disabledInCsr ||
          // resolve in CSR when resolver is enabled in devMode
          (isDevMode() && this.pageMetaConfig?.pageMeta?.enableInDevMode)
        );
      })
      .forEach(
        (resolver) => (resolverMethods[resolver.property] = resolver.method)
      );
    return resolverMethods;
  }

  /**
   * Return the resolver with the best match, based on a score
   * generated by the resolver.
   *
   * Resolvers match by default on `PageType` and `page.template`.
   */
  protected getMetaResolver(
    page: Page
  ): Observable<PageMetaResolver | undefined> {
    return this.resolvers$.pipe(
      map((resolvers) => resolveApplicable(resolvers, [page], [page]))
    );
  }
}
