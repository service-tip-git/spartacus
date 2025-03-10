/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { AbstractType, Injectable, Injector } from '@angular/core';
import {
  EMPTY,
  Observable,
  ReplaySubject,
  connectable,
  isObservable,
  throwError,
} from 'rxjs';
import { delay, map, shareReplay, switchMap } from 'rxjs/operators';
import { FeatureModulesService } from '../feature-modules.service';
import { FacadeDescriptor } from './facade-descriptor';

const PROXY_FACADE_INSTANCE_PROP = 'proxyFacadeInstance';

/**
 * Service that can create proxy facade, which is a service that will expose
 * methods and properties from a facade implemented in the lazy loaded module.
 *
 * Returned proxy facade will lazy load the feature and facade implementation
 * at first method call or when first property observable will be subscribed.
 */
@Injectable({
  providedIn: 'root',
})
export class FacadeFactoryService {
  constructor(
    protected featureModules: FeatureModulesService,
    protected injector: Injector
  ) {}

  protected getResolver<T>(
    feature: string,
    facadeClass: AbstractType<T>,
    async = false
  ): Observable<T> {
    if (!this.featureModules.isConfigured(feature)) {
      return throwError(
        () => new Error(`Feature ${feature} is not configured properly`)
      );
    }

    let facadeService$ = this.featureModules.resolveFeature(feature).pipe(
      map((moduleRef) => moduleRef.injector),
      map((injector) => injector.get(facadeClass))
    );
    if (async) {
      facadeService$ = facadeService$.pipe(delay(0));
    }
    return facadeService$.pipe(shareReplay());
  }

  /**
   * Calls a method on a facade
   *
   * Method should either return an observable or void. Any other return type
   * than observable is ignored.
   *
   * @param resolver$
   * @param method
   * @param args
   * @protected
   */
  protected call(
    resolver$: Observable<any>,
    method: string,
    args: unknown[]
  ): Observable<unknown> {
    const callResult$ = connectable(
      resolver$.pipe(map((service) => service[method](...args))),
      {
        connector: () => new ReplaySubject(),
        resetOnDisconnect: false,
      }
    );
    callResult$.connect();

    return callResult$.pipe(
      switchMap((result) => {
        if (isObservable(result)) {
          return result;
        }
        return EMPTY;
      })
    );
  }

  /**
   * Get the property value from the facade
   *
   * Property has to be an aobservable
   *
   * @param resolver$
   * @param property
   * @protected
   */
  protected get(
    resolver$: Observable<any>,
    property: string
  ): Observable<unknown> {
    return resolver$.pipe(switchMap((service) => service[property]));
  }

  create<T extends object>({
    facade,
    feature,
    methods,
    properties,
    async,
  }: FacadeDescriptor<T>): T {
    const resolver$ = this.getResolver(feature, facade, async);

    const result: any = new (class extends (facade as any) {})();
    (methods ?? []).forEach((method) => {
      result[method] = (...args: any[]) =>
        this.call(resolver$, method as string, args);
    });
    (properties ?? []).forEach((property) => {
      result[property] = this.get(resolver$, property as string);
    });

    result[PROXY_FACADE_INSTANCE_PROP] = true;

    return result;
  }

  /**
   * isProxyFacadeInstance tests if the provided facade is labeled as a proxy instance.
   * Facade proxy instances contain an object key to label them as such.
   * @param facade The facade object to evaluate
   */
  isProxyFacadeInstance(facade: any) {
    return !!facade?.[PROXY_FACADE_INSTANCE_PROP];
  }
}
