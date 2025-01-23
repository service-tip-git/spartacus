/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ConsentTemplate, AnonymousConsentsService } from '@spartacus/core';
import {
  CdcConsent,
  CdcConsentManagementComponentService,
  CdcConsentWithStatus,
} from '@spartacus/cdc/root';
import {
  FocusConfig,
  ICON_TYPE,
  LaunchDialogService,
} from '@spartacus/storefront';
import { Subscription, BehaviorSubject, Observable, map } from 'rxjs';
import { CdcReconsentComponentService } from './cdc-reconsent-component.service';

@Component({
  selector: 'cx-anonymous-consent-dialog', //reusing existing selector
  templateUrl: './cdc-reconsent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CdcReconsentComponent implements OnInit, OnDestroy {
  protected subscription = new Subscription();
  protected cdcConsentManagementComponentService = inject(
    CdcConsentManagementComponentService
  );

  form: UntypedFormGroup = new UntypedFormGroup({});
  iconTypes = ICON_TYPE;
  loaded$ = new BehaviorSubject<boolean>(false);
  templateList$: Observable<ConsentTemplate[]>;
  reconsentEvent: any = {};
  requiredReconsents: string[] = [];
  selectedConsents: string[] = [];
  disableSubmitButton: boolean = true;
  totalConsents: number = 0;

  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: 'button',
    focusOnEscape: true,
  };

  constructor(
    protected launchDialogService: LaunchDialogService,
    protected anonymousConsentsService: AnonymousConsentsService,
    protected cdcReconsentService: CdcReconsentComponentService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.launchDialogService.data$.subscribe((data) => {
        this.reconsentEvent = { ...data };
        this.loadConsents(data.consentIds);
      })
    );
  }

  loadConsents(reconsentIds: string[]): void {
    this.templateList$ = this.anonymousConsentsService
      .getTemplates(true)
      .pipe(
        map((templates) =>
          templates.filter((template) =>
            reconsentIds.includes(template.id || '')
          )
        )
      );
    this.requiredReconsents = reconsentIds.filter((id) =>
      this.cdcConsentManagementComponentService
        .getCdcConsentIDs(true)
        .includes(id)
    );
    this.disableSubmitButton = this.requiredReconsents.length > 0;
    this.loaded$.next(true);
  }

  onConsentChange(event: { given: boolean; template: ConsentTemplate }) {
    if (!event.template?.id) return;

    const { given, template } = event;
    this.updateSelectedConsents(given, template.id ?? '');

    this.areAllMandatoryConsentsGiven().subscribe((result) => {
      this.disableSubmitButton = !result;
    });
  }

  dismissDialog(reason?: any, message?: string): void {
    if (reason === 'Proceed To Login') {
      this.loaded$.next(false);
      this.templateList$.subscribe((templates) => {
        const consents = this.buildConsents(templates);
        if (consents.length) {
          console.log(consents);
          this.cdcReconsentService.saveConsentAndLoginV2(
            consents,
            this.reconsentEvent
          );
        }
      });
    } else {
      this.cdcReconsentService.handleReconsentUpdateError(reason, message);
    }
  }

  private buildConsents(templates: ConsentTemplate[]): CdcConsentWithStatus[] {
    const preferences: Record<string, CdcConsent> =
      this.reconsentEvent.preferences || {};
    const consents = Object.entries(preferences).map(([id, value]) => ({
      id,
      isConsentGranted: value?.isConsentGranted || false,
    }));

    templates.forEach((template) => {
      const existingIndex = consents.findIndex(
        (consent) => consent.id === template.id
      );
      // If the id is already present, remove the existing item
      if (existingIndex !== -1) {
        consents.splice(existingIndex, 1);
      }
      //Push the new object into the array
      consents.push({
        id: template.id || '',
        isConsentGranted: this.selectedConsents.includes(template.id || ''),
      });
    });
    return consents;
  }

  areAllMandatoryConsentsGiven(): Observable<boolean> {
    return this.templateList$.pipe(
      map((templates) =>
        templates.every(
          (template) =>
            !this.requiredReconsents.includes(template.id || '') ||
            this.selectedConsents.includes(template.id || '')
        )
      )
    );
  }

  private updateSelectedConsents(given: boolean, templateId: string): void {
    if (given) {
      if (!this.selectedConsents.includes(templateId)) {
        this.selectedConsents.push(templateId);
      }
    } else {
      this.selectedConsents = this.selectedConsents.filter(
        (id) => id !== templateId
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
