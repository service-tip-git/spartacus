/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, inject, isDevMode } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { EMPTY, Observable, of } from 'rxjs';
import {
  catchError,
  concatMap,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { AuthActions, AuthService, UserIdService } from '../../../auth/index';
import { LoggerService } from '../../../logger';
import { UserConsentService } from '../../../user/facade/user-consent.service';
import { UserActions } from '../../../user/store/actions/index';
import { tryNormalizeHttpError } from '../../../util/try-normalize-http-error';
import { AnonymousConsentsConfig } from '../../config/anonymous-consents-config';
import { AnonymousConsentTemplatesConnector } from '../../connectors/anonymous-consent-templates.connector';
import { AnonymousConsentsService } from '../../facade/index';
import { AnonymousConsentsActions } from '../actions/index';

@Injectable()
export class AnonymousConsentsEffects {
  protected logger = inject(LoggerService);

  checkConsentVersions$: Observable<
    | AnonymousConsentsActions.LoadAnonymousConsentTemplates
    | AnonymousConsentsActions.LoadAnonymousConsentTemplatesFail
    | Observable<never>
  > = createEffect(() =>
    this.actions$.pipe(
      ofType(AnonymousConsentsActions.ANONYMOUS_CONSENT_CHECK_UPDATED_VERSIONS),
      withLatestFrom(this.anonymousConsentService.getConsents()),
      concatMap(([_, currentConsents]) => {
        return this.anonymousConsentTemplatesConnector
          .loadAnonymousConsents()
          .pipe(
            map((newConsents) => {
              if (!newConsents) {
                if (isDevMode()) {
                  this.logger.warn(
                    'No consents were loaded. Please check the Spartacus documentation as this could be a back-end configuration issue.'
                  );
                }
                return false;
              }

              const currentConsentVersions = currentConsents.map(
                (consent) => consent.templateVersion
              );
              const newConsentVersions = newConsents.map(
                (consent) => consent.templateVersion
              );

              return this.detectUpdatedVersion(
                currentConsentVersions,
                newConsentVersions
              );
            }),
            switchMap((updated) =>
              updated
                ? of(
                    new AnonymousConsentsActions.LoadAnonymousConsentTemplates()
                  )
                : EMPTY
            ),
            catchError((error) =>
              of(
                new AnonymousConsentsActions.LoadAnonymousConsentTemplatesFail(
                  tryNormalizeHttpError(error, this.logger)
                )
              )
            )
          );
      })
    )
  );

  loadAnonymousConsentTemplates$: Observable<AnonymousConsentsActions.AnonymousConsentsActions> =
    createEffect(() =>
      this.actions$.pipe(
        ofType(AnonymousConsentsActions.LOAD_ANONYMOUS_CONSENT_TEMPLATES),
        withLatestFrom(this.anonymousConsentService.getTemplates()),
        concatMap(([_, currentConsentTemplates]) =>
          this.anonymousConsentTemplatesConnector
            .loadAnonymousConsentTemplates()
            .pipe(
              mergeMap((newConsentTemplates) => {
                let updated = false;
                if (
                  currentConsentTemplates &&
                  currentConsentTemplates.length !== 0
                ) {
                  updated = this.anonymousConsentService.detectUpdatedTemplates(
                    currentConsentTemplates,
                    newConsentTemplates
                  );
                }

                return [
                  new AnonymousConsentsActions.LoadAnonymousConsentTemplatesSuccess(
                    newConsentTemplates
                  ),
                  new AnonymousConsentsActions.ToggleAnonymousConsentTemplatesUpdated(
                    updated
                  ),
                ];
              }),
              catchError((error) =>
                of(
                  new AnonymousConsentsActions.LoadAnonymousConsentTemplatesFail(
                    tryNormalizeHttpError(error, this.logger)
                  )
                )
              )
            )
        )
      )
    );

  // TODO(#9416): This won't work with flow different than `Resource Owner Password Flow` which involves redirect (maybe in popup in will work)

  transferAnonymousConsentsToUser$: Observable<
    UserActions.TransferAnonymousConsent | Observable<never>
  > = createEffect(() =>
    this.actions$.pipe(
      ofType<AuthActions.Login>(AuthActions.LOGIN),
      filter(() => Boolean(this.anonymousConsentsConfig.anonymousConsents)),
      withLatestFrom(
        this.actions$.pipe(
          ofType<UserActions.RegisterUserSuccess>(
            UserActions.REGISTER_USER_SUCCESS
          )
        )
      ),
      filter(([, registerAction]) => Boolean(registerAction)),
      switchMap(() =>
        this.anonymousConsentService.getConsents().pipe(
          withLatestFrom(
            this.userIdService.getUserId(),
            this.anonymousConsentService.getTemplates(),
            this.authService.isUserLoggedIn()
          ),
          filter(([, , , loggedIn]) => loggedIn),
          concatMap(([consents, userId, templates, _loggedIn]) => {
            const actions: UserActions.TransferAnonymousConsent[] = [];
            for (const consent of consents) {
              if (
                this.anonymousConsentService.isConsentGiven(consent) &&
                !this.isRequiredConsent(consent.templateCode)
              ) {
                for (const template of templates) {
                  if (template.id === consent.templateCode) {
                    actions.push(
                      new UserActions.TransferAnonymousConsent({
                        userId,
                        consentTemplateId: template.id,
                        consentTemplateVersion: template.version,
                      })
                    );
                    break;
                  }
                }
              }
            }
            if (actions.length > 0) {
              return actions;
            }
            return EMPTY;
          })
        )
      )
    )
  );

  private isRequiredConsent(templateCode: string | undefined): boolean {
    return Boolean(
      templateCode &&
        this.anonymousConsentsConfig.anonymousConsents?.requiredConsents?.includes(
          templateCode
        )
    );
  }

  giveRequiredConsentsToUser$: Observable<
    UserActions.GiveUserConsent | Observable<never>
  > = createEffect(() =>
    this.actions$.pipe(
      ofType<AuthActions.Login>(AuthActions.LOGIN),
      filter((action) =>
        Boolean(
          this.anonymousConsentsConfig.anonymousConsents &&
            this.anonymousConsentsConfig.anonymousConsents.requiredConsents &&
            action
        )
      ),
      concatMap(() =>
        this.userConsentService.getConsentsResultSuccess().pipe(
          take(1),
          withLatestFrom(
            this.userIdService.getUserId(),
            this.userConsentService.getConsents(),
            this.authService.isUserLoggedIn()
          ),
          filter(([, , , loggedIn]) => loggedIn),
          tap(([loaded, _userId, _templates, _loggedIn]) => {
            if (!loaded) {
              this.userConsentService.loadConsents();
            }
          }),
          map(([_loaded, userId, templates, _loggedIn]) => {
            return { userId, templates };
          }),
          concatMap(({ userId, templates }) => {
            const actions: UserActions.GiveUserConsent[] = [];
            for (const template of templates) {
              if (
                this.userConsentService.isConsentWithdrawn(
                  template.currentConsent
                ) &&
                this.isRequiredConsent(template.id)
              ) {
                actions.push(
                  new UserActions.GiveUserConsent({
                    userId,
                    consentTemplateId: template.id,
                    consentTemplateVersion: template.version,
                  })
                );
              }
            }
            return actions.length > 0 ? actions : EMPTY;
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private anonymousConsentTemplatesConnector: AnonymousConsentTemplatesConnector,
    private authService: AuthService,
    private anonymousConsentsConfig: AnonymousConsentsConfig,
    private anonymousConsentService: AnonymousConsentsService,
    private userConsentService: UserConsentService,
    private userIdService: UserIdService
  ) {}

  /**
   * Compares the given versions and determines if there's a mismatch,
   * in which case `true` is returned.
   *
   * @param currentVersions versions of the current consents
   * @param newVersions versions of the new consents
   */
  private detectUpdatedVersion(
    currentVersions: (number | undefined)[],
    newVersions: (number | undefined)[]
  ): boolean {
    if (currentVersions.length !== newVersions.length) {
      return true;
    }

    for (let i = 0; i < newVersions.length; i++) {
      if (currentVersions[i] !== newVersions[i]) {
        return true;
      }
    }

    return false;
  }
}
