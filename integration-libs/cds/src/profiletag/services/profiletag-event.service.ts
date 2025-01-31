/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { isPlatformBrowser } from '@angular/common';
import {
  Inject,
  inject,
  Injectable,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { BaseSiteService, LoggerService, WindowRef } from '@spartacus/core';
import {
  BehaviorSubject,
  fromEvent,
  merge,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  take,
  tap,
} from 'rxjs/operators';
import { CdsConfig } from '../../config/index';
import {
  ConsentReferenceEvent,
  DebugEvent,
  InternalProfileTagEventNames,
  ProfileTagJsConfig,
  ProfileTagPushEvent,
  ProfileTagWindowObject,
} from '../model/profile-tag.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileTagEventService implements OnDestroy {
  protected subscription: Subscription = new Subscription();
  latestConsentReference: BehaviorSubject<string | null>;
  profileTagDebug = false;
  private consentReference$: Observable<string | null> | null;
  private profileTagWindow: ProfileTagWindowObject;
  private profileTagEvents$ = merge(
    this.setConsentReference(),
    this.debugModeChanged()
  );

  protected logger = inject(LoggerService);

  constructor(
    private winRef: WindowRef,
    private config: CdsConfig,
    private baseSiteService: BaseSiteService,
    @Inject(PLATFORM_ID) private platform: any
  ) {
    this.initWindow();
    this.setConsentReferenceFromLocalStorage();
  }

  private setConsentReferenceFromLocalStorage(): void {
    if (this.winRef.isBrowser() && this.winRef.localStorage) {
      const profileTagMetadata = JSON.parse(
        this.winRef.localStorage.getItem('profiletag') || '{"cr":{}}'
      );
      this.subscription.add(
        this.baseSiteService
          .getActive()
          .pipe(take(1))
          .subscribe((baseSite) => {
            this.latestConsentReference = new BehaviorSubject(
              profileTagMetadata.cr[
                `${baseSite}-consentReference`
              ]?.consentReference
            );
          })
      );
    }
  }

  getProfileTagEvents(): Observable<string | DebugEvent | Event | null> {
    return this.profileTagEvents$;
  }

  getConsentReference(): Observable<string | null> | null {
    if (!this.consentReference$ && this.winRef.nativeWindow) {
      this.consentReference$ = fromEvent(
        this.winRef.nativeWindow,
        InternalProfileTagEventNames.CONSENT_REFERENCE_LOADED
      ).pipe(
        map((event) => <ConsentReferenceEvent>event),
        map((event) => event.detail.consentReference),
        shareReplay(1)
      );
    }
    return this.consentReference$;
  }

  handleConsentWithdrawn(): void {
    this.consentReference$ = null;
    this.latestConsentReference.next(null);
  }

  addTracker(): Observable<string> {
    return this.baseSiteService.getActive().pipe(
      filter(() => isPlatformBrowser(this.platform)),
      filter((siteId: string) => Boolean(siteId)),
      distinctUntilChanged(),
      tap(() => this.addScript()),
      tap((siteId: string) => this.createConfig(siteId))
    );
  }

  notifyProfileTagOfEventOccurrence(event: ProfileTagPushEvent): void {
    try {
      this.profileTagWindow?.Y_TRACKING?.eventLayer?.push(event);
    } catch (e) {
      this.logger.log(
        `Unexpected error when calling profiletag push method ${e}`
      );
    }
  }

  private setConsentReference(): Observable<string | null> {
    return this.winRef.nativeWindow && !!this.getConsentReference()
      ? this.getConsentReference().pipe(
          tap((consentReference) => {
            this.latestConsentReference.next(consentReference);
          })
        )
      : of(null);
  }

  private debugModeChanged(): Observable<DebugEvent> {
    return this.winRef.nativeWindow
      ? fromEvent(
          this.winRef.nativeWindow,
          InternalProfileTagEventNames.DEBUG_FLAG_CHANGED
        ).pipe(
          map((event) => <DebugEvent>event),
          tap((event) => (this.profileTagDebug = event.detail.debug))
        )
      : of();
  }

  private createConfig(siteId: string): void {
    const cds = this.config.cds;
    if (cds) {
      const newConfig: ProfileTagJsConfig = {
        ...cds.profileTag,
        tenant: cds.tenant,
        siteId,
        spa: true,
      };
      this.exposeConfig(newConfig);
    }
  }

  /*
   * Checks if the script with the given source exists in the document or not.
   */
  private isScriptLoaded(scriptSource: string): boolean {
    return !!this.winRef.document.querySelector(
      `script[src="${scriptSource}"]`
    );
  }

  private addScript(): void {
    const javascriptUrl = this.config.cds?.profileTag?.javascriptUrl;
    if (javascriptUrl) {
      if (this.isScriptLoaded(javascriptUrl)) {
        return;
      }
      const profileTagScript = this.winRef.document.createElement('script');
      profileTagScript.type = 'text/javascript';
      profileTagScript.async = true;
      profileTagScript.src = javascriptUrl;
      this.winRef.document
        .getElementsByTagName('head')[0]
        .appendChild(profileTagScript);
    }
  }

  private initWindow(): void {
    if (!isPlatformBrowser(this.platform)) {
      return;
    }
    this.profileTagWindow = <ProfileTagWindowObject>(
      (<unknown>this.winRef.nativeWindow)
    );
    this.profileTagWindow.Y_TRACKING = this.profileTagWindow.Y_TRACKING || {};
    this.profileTagWindow.Y_TRACKING.eventLayer =
      this.profileTagWindow.Y_TRACKING.eventLayer || [];
  }

  private exposeConfig(options: ProfileTagJsConfig): void {
    const q = this.profileTagWindow.Y_TRACKING.q || [];
    if (q.length !== 0) {
      return;
    }
    q.push([options]);
    this.profileTagWindow.Y_TRACKING.q = q;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
