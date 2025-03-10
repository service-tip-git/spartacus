/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AnonymousConsentsConfig,
  AnonymousConsentsService,
  AuthService,
  ConsentTemplate,
  GlobalMessageService,
  GlobalMessageType,
  UserConsentService,
} from '@spartacus/core';
import {
  BehaviorSubject,
  combineLatest,
  concat,
  Observable,
  Subscription,
} from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  scan,
  skipWhile,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { ConsentManagementComponentService } from '../consent-management-component.service';

@Component({
  selector: 'cx-consent-management',
  templateUrl: './consent-management.component.html',
  standalone: false,
})
export class ConsentManagementComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private allConsentsLoading = new BehaviorSubject<boolean>(false);

  templateList$: Observable<ConsentTemplate[]>;
  loading$: Observable<boolean>;

  requiredConsents: string[] = [];

  get allConsentsLoading$() {
    return this.allConsentsLoading.asObservable();
  }

  constructor(
    protected userConsentService: UserConsentService,
    protected globalMessageService: GlobalMessageService,
    protected anonymousConsentsConfig: AnonymousConsentsConfig,
    protected anonymousConsentsService: AnonymousConsentsService,
    protected authService: AuthService,
    protected consentManagementComponentService?: ConsentManagementComponentService
  ) {}

  ngOnInit(): void {
    this.loading$ = combineLatest([
      this.userConsentService.getConsentsResultLoading(),
      this.userConsentService.getGiveConsentResultLoading(),
      this.userConsentService.getWithdrawConsentResultLoading(),
      this.authService.isUserLoggedIn(),
      this.allConsentsLoading,
    ]).pipe(
      map(
        ([
          consentLoading,
          giveConsentLoading,
          withdrawConsentLoading,
          isUserLoggedIn,
          allConsentsLoading,
        ]) =>
          consentLoading ||
          giveConsentLoading ||
          withdrawConsentLoading ||
          !isUserLoggedIn ||
          allConsentsLoading
      )
    );
    this.consentListInit();
    this.giveConsentInit();
    this.withdrawConsentInit();
  }

  private consentListInit(): void {
    this.templateList$ = this.userConsentService.getConsents().pipe(
      withLatestFrom(
        this.anonymousConsentsService.getTemplates(),
        this.authService.isUserLoggedIn()
      ),
      filter(
        ([_templateList, _anonymousTemplates, isUserLoggedIn]) => isUserLoggedIn
      ),
      tap(([templateList, _anonymousTemplates]) => {
        if (!this.consentsExists(templateList)) {
          this.userConsentService.loadConsents();
        }
      }),
      map(([templateList, anonymousTemplates]) => {
        this.requiredConsents = this.consentManagementComponentService
          ? this.consentManagementComponentService.getRequiredConsents(
              templateList
            )
          : [];
        if (this.anonymousConsentsConfig.anonymousConsents) {
          if (
            this.anonymousConsentsConfig.anonymousConsents.consentManagementPage
          ) {
            return this.hideAnonymousConsents(templateList, anonymousTemplates);
          }
        }

        return templateList;
      })
    );
  }

  private hideAnonymousConsents(
    templateList: ConsentTemplate[],
    anonymousTemplates: ConsentTemplate[] = []
  ): ConsentTemplate[] {
    let hideTemplateIds: string[] = [];

    if (
      !this.anonymousConsentsConfig.anonymousConsents?.consentManagementPage
        ?.showAnonymousConsents
    ) {
      hideTemplateIds = anonymousTemplates.map((template) => template.id ?? '');
      return this.userConsentService.filterConsentTemplates(
        templateList,
        hideTemplateIds
      );
    }

    if (
      this.anonymousConsentsConfig.anonymousConsents.consentManagementPage
        .hideConsents &&
      this.anonymousConsentsConfig.anonymousConsents.consentManagementPage
        .hideConsents.length > 0
    ) {
      hideTemplateIds =
        this.anonymousConsentsConfig.anonymousConsents.consentManagementPage
          .hideConsents;
    }

    return this.userConsentService.filterConsentTemplates(
      templateList,
      hideTemplateIds
    );
  }

  private giveConsentInit(): void {
    this.userConsentService.resetGiveConsentProcessState();
    this.subscriptions.add(
      this.userConsentService
        .getGiveConsentResultSuccess()
        .subscribe((success) => this.onConsentGivenSuccess(success))
    );
  }

  private withdrawConsentInit(): void {
    this.userConsentService.resetWithdrawConsentProcessState();
    this.subscriptions.add(
      this.userConsentService
        .getWithdrawConsentResultLoading()
        .pipe(
          skipWhile(Boolean),
          withLatestFrom(
            this.userConsentService.getWithdrawConsentResultSuccess()
          ),
          map(([, withdrawalSuccess]) => withdrawalSuccess),
          tap((withdrawalSuccess) => {
            if (withdrawalSuccess) {
              this.userConsentService.loadConsents();
            }
          })
        )
        .subscribe((withdrawalSuccess) =>
          this.onConsentWithdrawnSuccess(withdrawalSuccess)
        )
    );
  }

  private consentsExists(templateList: ConsentTemplate[]): boolean {
    return Boolean(templateList) && templateList.length > 0;
  }

  onConsentChange({
    given,
    template,
  }: {
    given: boolean;
    template: ConsentTemplate;
  }): void {
    if (given && template.id && template.version !== undefined) {
      this.userConsentService.giveConsent(template.id, template.version);
    } else if (template.currentConsent?.code) {
      this.userConsentService.withdrawConsent(
        template.currentConsent.code,
        template?.id
      );
    }
  }

  private onConsentGivenSuccess(success: boolean): void {
    if (success) {
      this.userConsentService.resetGiveConsentProcessState();
      this.globalMessageService.add(
        { key: 'consentManagementForm.message.success.given' },
        GlobalMessageType.MSG_TYPE_CONFIRMATION
      );
    }
  }

  private onConsentWithdrawnSuccess(success: boolean): void {
    if (success) {
      this.userConsentService.resetWithdrawConsentProcessState();
      this.globalMessageService.add(
        { key: 'consentManagementForm.message.success.withdrawn' },
        GlobalMessageType.MSG_TYPE_CONFIRMATION
      );
    }
  }

  rejectAll(templates: ConsentTemplate[] = []): void {
    const consentsToWithdraw: ConsentTemplate[] = [];
    templates.forEach((template) => {
      if (
        template.currentConsent &&
        this.userConsentService.isConsentGiven(template.currentConsent)
      ) {
        if (this.isRequiredConsent(template)) {
          return;
        }
        consentsToWithdraw.push(template);
      }
    });

    this.allConsentsLoading.next(true);

    this.subscriptions.add(
      this.setupWithdrawalStream(consentsToWithdraw)
        .pipe(tap((_timesLoaded) => this.allConsentsLoading.next(false)))
        .subscribe()
    );
  }

  private setupWithdrawalStream(
    consentsToWithdraw: ConsentTemplate[] = []
  ): Observable<number> {
    const loading$ = concat(
      this.userConsentService.getWithdrawConsentResultLoading()
    ).pipe(
      distinctUntilChanged(),
      filter((loading) => !loading)
    );
    const count$ = loading$.pipe(scan((acc, _value) => acc + 1, -1));
    const withdraw$ = count$.pipe(
      tap((i) => {
        if (i < consentsToWithdraw.length) {
          const code = consentsToWithdraw[i].currentConsent?.code;
          const id = consentsToWithdraw[i]?.id;
          if (code) {
            this.userConsentService.withdrawConsent(code, id);
          }
        }
      })
    );
    const checkTimesLoaded$ = withdraw$.pipe(
      filter((timesLoaded) => timesLoaded === consentsToWithdraw.length)
    );

    return checkTimesLoaded$;
  }

  allowAll(templates: ConsentTemplate[] = []): void {
    const consentsToGive: ConsentTemplate[] = [];
    templates.forEach((template) => {
      const givenDate = template.currentConsent?.consentGivenDate;
      const withdrawnDate = template.currentConsent?.consentWithdrawnDate;
      const isConsentGiven =
        (givenDate && !withdrawnDate) ||
        (givenDate && withdrawnDate && givenDate > withdrawnDate);
      if (isConsentGiven) {
        return;
      }
      if (
        template.currentConsent &&
        this.userConsentService.isConsentWithdrawn(template.currentConsent)
      ) {
        if (this.isRequiredConsent(template)) {
          return;
        }
      }
      consentsToGive.push(template);
    });

    this.allConsentsLoading.next(true);

    this.subscriptions.add(
      this.setupGiveStream(consentsToGive)
        .pipe(tap((_timesLoaded) => this.allConsentsLoading.next(false)))
        .subscribe()
    );
  }

  private setupGiveStream(
    consentsToGive: ConsentTemplate[] = []
  ): Observable<number> {
    const loading$ = concat(
      this.userConsentService.getGiveConsentResultLoading()
    ).pipe(
      distinctUntilChanged(),
      filter((loading) => !loading)
    );
    const count$ = loading$.pipe(scan((acc, _value) => acc + 1, -1));
    const giveConsent$ = count$.pipe(
      tap((i) => {
        if (i < consentsToGive.length) {
          const consent = consentsToGive[i];
          if (consent.id && consent.version !== undefined) {
            this.userConsentService.giveConsent(consent.id, consent.version);
          }
        }
      })
    );
    const checkTimesLoaded$ = giveConsent$.pipe(
      filter((timesLoaded) => timesLoaded === consentsToGive.length)
    );

    return checkTimesLoaded$;
  }

  private isRequiredConsent(template: ConsentTemplate): boolean {
    return Boolean(
      template.id &&
        this.anonymousConsentsConfig.anonymousConsents &&
        this.anonymousConsentsConfig.anonymousConsents?.requiredConsents &&
        this.anonymousConsentsConfig.anonymousConsents.requiredConsents.includes(
          template.id
        )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.allConsentsLoading.unsubscribe();

    this.userConsentService.resetGiveConsentProcessState();
    this.userConsentService.resetWithdrawConsentProcessState();
  }
}
