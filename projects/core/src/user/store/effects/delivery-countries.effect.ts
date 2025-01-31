/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LoggerService } from '../../../logger';
import { CountryType } from '../../../model/address.model';
import { SiteConnector } from '../../../site-context/connectors/site.connector';
import { normalizeHttpError } from '../../../util/normalize-http-error';
import { UserActions } from '../actions/index';

@Injectable()
export class DeliveryCountriesEffects {
  protected logger = inject(LoggerService);

  loadDeliveryCountries$: Observable<UserActions.DeliveryCountriesAction> =
    createEffect(() =>
      this.actions$.pipe(
        ofType(UserActions.LOAD_DELIVERY_COUNTRIES),
        switchMap(() => {
          return this.siteConnector.getCountries(CountryType.SHIPPING).pipe(
            map(
              (countries) =>
                new UserActions.LoadDeliveryCountriesSuccess(countries)
            ),
            catchError((error) =>
              of(
                new UserActions.LoadDeliveryCountriesFail(
                  normalizeHttpError(error, this.logger)
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
