/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  NotificationPreference,
  UserNotificationPreferenceService,
} from '@spartacus/core';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'cx-notification-preference',
  templateUrl: './notification-preference.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class NotificationPreferenceComponent implements OnInit {
  preferences$: Observable<NotificationPreference[]>;
  isLoading$: Observable<boolean>;

  protected preferences: NotificationPreference[] = [];

  constructor(
    private notificationPreferenceService: UserNotificationPreferenceService
  ) {}

  ngOnInit() {
    this.notificationPreferenceService.resetNotificationPreferences();
    this.preferences$ = this.notificationPreferenceService
      .getPreferences()
      .pipe(tap((preferences) => (this.preferences = preferences)));
    this.notificationPreferenceService.loadPreferences();

    this.isLoading$ = combineLatest([
      this.notificationPreferenceService.getPreferencesLoading(),
      this.notificationPreferenceService.getUpdatePreferencesResultLoading(),
    ]).pipe(
      map(([prefsLoading, updateLoading]) => prefsLoading || updateLoading)
    );
  }

  updatePreference(preference: NotificationPreference) {
    const updatedPreferences: NotificationPreference[] = [];
    this.preferences.forEach((p) => {
      if (p.channel === preference.channel) {
        updatedPreferences.push({
          ...p,
          enabled: !p.enabled,
        });
      } else {
        updatedPreferences.push(p);
      }
    });
    this.notificationPreferenceService.updatePreferences(updatedPreferences);
  }
}
