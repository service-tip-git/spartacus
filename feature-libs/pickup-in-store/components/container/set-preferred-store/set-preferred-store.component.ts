/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { useFeatureStyles } from '@spartacus/core';

import {
  PointOfServiceNames,
  PreferredStoreFacade,
} from '@spartacus/pickup-in-store/root';
import { ICON_TYPE, OutletContextData } from '@spartacus/storefront';
import { Observable, Subscription } from 'rxjs';
import { NgClass, AsyncPipe } from '@angular/common';
import { IconComponent } from '../../../../../projects/storefrontlib/cms-components/misc/icon/icon.component';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';

@Component({
    selector: 'cx-set-preferred-store',
    templateUrl: './set-preferred-store.component.html',
    imports: [
        NgClass,
        IconComponent,
        AsyncPipe,
        TranslatePipe,
        MockTranslatePipe,
    ],
})
export class SetPreferredStoreComponent implements OnInit, OnDestroy {
  readonly ICON_TYPE = ICON_TYPE;
  @Input() pointOfServiceName: PointOfServiceNames;

  public storeSelected$: Observable<PointOfServiceNames | null> =
    this.preferredStoreFacade.getPreferredStore$();
  subscription: Subscription = new Subscription();

  constructor(
    protected preferredStoreFacade: PreferredStoreFacade,
    @Optional() protected outlet: OutletContextData<PointOfServiceNames>
  ) {
    useFeatureStyles('a11yVisibleFocusOverflows');
  }

  ngOnInit() {
    this.subscription.add(
      this.outlet?.context$.subscribe(
        (pointOfServiceNames) => (this.pointOfServiceName = pointOfServiceNames)
      )
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  setAsPreferred(): boolean {
    this.preferredStoreFacade.setPreferredStore(this.pointOfServiceName);
    return false;
  }
}
