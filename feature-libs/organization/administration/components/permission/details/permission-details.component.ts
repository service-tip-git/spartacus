/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Permission } from '@spartacus/organization/administration/core';
import { Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { ItemService } from '../../shared/item.service';
import { PermissionItemService } from '../services/permission-item.service';
import { MockTranslatePipe } from '../../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { TranslatePipe } from '../../../../../../projects/core/src/i18n/translate.pipe';
import { UrlPipe } from '../../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { ItemExistsDirective } from '../../shared/item-exists.directive';
import { DisableInfoComponent } from '../../shared/detail/disable-info/disable-info.component';
import { ToggleStatusComponent } from '../../shared/detail/toggle-status-action/toggle-status.component';
import { RouterLink } from '@angular/router';
import { FocusDirective } from '../../../../../../projects/storefrontlib/layout/a11y/keyboard-focus/focus.directive';
import { CardComponent } from '../../shared/card/card.component';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-org-permission-details',
  templateUrl: './permission-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ItemService,
      useExisting: PermissionItemService,
    },
  ],
  host: { class: 'content-wrapper' },
  standalone: true,
  imports: [
    NgIf,
    CardComponent,
    FocusDirective,
    RouterLink,
    ToggleStatusComponent,
    DisableInfoComponent,
    ItemExistsDirective,
    AsyncPipe,
    UrlPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class PermissionDetailsComponent {
  model$: Observable<Permission> = this.itemService.key$.pipe(
    switchMap((code) => this.itemService.load(code)),
    startWith({})
  );
  isInEditMode$ = this.itemService.isInEditMode$;

  constructor(protected itemService: ItemService<Permission>) {}
}
