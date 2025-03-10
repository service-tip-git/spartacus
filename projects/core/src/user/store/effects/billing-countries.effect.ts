/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LoggerService } from '../../../logger';
import { CountryType } from '../../../model/address.model';
import { SiteConnector } from '../../../site-context/connectors/site.connector';
import { tryNormalizeHttpError } from '../../../util/try-normalize-http-error';
import { UserActions } from '../actions/index';

@Injectable()
export class BillingCountriesEffect {
  protected logger = inject(LoggerService);

  loadBillingCountries$: Observable<UserActions.BillingCountriesAction> =
    createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.LOAD_BILLING_COUNTRIES),
        switchMap(() => {
          return this.siteConnector.getCountries(CountryType.BILLING).pipe(
            map(
              (countries) =>
                new UserActions.LoadBillingCountriesSuccess(countries)
            ),
            catchError((error) =>
              of(
                new UserActions.LoadBillingCountriesFail(
                  tryNormalizeHttpError(error, this.logger)
                )
              )
            )
          );
        })
      )
    );

  constructor(
    private actions$: Actions,
    private siteConnector: SiteConnector
  ) {}
}
