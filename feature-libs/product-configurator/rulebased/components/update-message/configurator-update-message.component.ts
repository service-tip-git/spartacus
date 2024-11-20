/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfiguratorRouterExtractorService } from '@spartacus/product-configurator/common';
import { Observable, of } from 'rxjs';
import { delay, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ConfiguratorCommonsService } from '../../core/facade/configurator-commons.service';
import { ConfiguratorMessageConfig } from '../config/configurator-message.config';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { AsyncPipe } from '@angular/common';
import { SpinnerComponent } from '../../../../../projects/storefrontlib/shared/components/spinner/spinner.component';

@Component({
  selector: 'cx-configurator-update-message',
  templateUrl: './configurator-update-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SpinnerComponent, AsyncPipe, TranslatePipe, MockTranslatePipe],
})
export class ConfiguratorUpdateMessageComponent {
  hasPendingChanges$: Observable<boolean> = this.configRouterExtractorService
    .extractRouterData()
    .pipe(
      switchMap((routerData) =>
        this.configuratorCommonsService.hasPendingChanges(routerData.owner)
      ),
      distinctUntilChanged(), // avoid subsequent emissions of the same value from the source observable
      switchMap(
        (isLoading) =>
          isLoading
            ? of(isLoading).pipe(
                delay(
                  this.config.productConfigurator?.updateConfigurationMessage
                    ?.waitingTime || 1000
                )
              ) // delay information if it is loading
            : of(isLoading) // inform immediately if it's not loading anymore
      )
    );

  constructor(
    protected configuratorCommonsService: ConfiguratorCommonsService,
    protected configRouterExtractorService: ConfiguratorRouterExtractorService,
    protected config: ConfiguratorMessageConfig
  ) {}
}
