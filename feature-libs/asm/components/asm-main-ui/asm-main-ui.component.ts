/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AsmService } from '@spartacus/asm/core';
import {
  AsmDeepLinkParameters,
  AsmUi,
  CsAgentAuthService,
  CustomerListColumnActionType,
} from '@spartacus/asm/root';
import {
  AuthService,
  GlobalMessageService,
  GlobalMessageType,
  HttpErrorModel,
  RoutingService,
  User,
} from '@spartacus/core';
import {
  ICON_TYPE,
  LAUNCH_CALLER,
  LaunchDialogService,
} from '@spartacus/storefront';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { Observable, Subscription, combineLatest, of } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { CustomerListAction } from '../customer-list/customer-list.model';
import { AsmComponentService } from '../services/asm-component.service';
interface CartTypeKey {
  [key: string]: string;
}

export const CART_TYPE_KEY: CartTypeKey = {
  active: 'asm.activeCartAlertInfo',
  inactive: 'asm.saveInactiveCartAlertInfo',
};
@Component({
  selector: 'cx-asm-main-ui',
  templateUrl: './asm-main-ui.component.html',
})
export class AsmMainUiComponent implements OnInit, OnDestroy {
  customerSupportAgentLoggedIn$: Observable<boolean>;
  csAgentTokenLoading$: Observable<boolean>;
  customer$: Observable<User | undefined>;
  isCollapsed$: Observable<boolean> | undefined;
  iconTypes = ICON_TYPE;

  showDeeplinkCartInfoAlert$: Observable<boolean> =
    this.asmComponentService.shouldShowDeeplinkCartInfoAlert();
  deeplinkCartAlertKey: string = '';

  showCreateCustomerSuccessfullyAlert = false;

  globalMessageType = GlobalMessageType;

  @HostBinding('class.hidden') disabled = false;

  protected startingCustomerSession = false;
  showCustomerEmulationInfoAlert = true;

  subscription: Subscription = new Subscription();

  @ViewChild('customerListLink') element: ElementRef;
  @ViewChild('addNewCustomerLink') addNewCustomerLink: ElementRef;

  constructor(
    protected authService: AuthService,
    protected csAgentAuthService: CsAgentAuthService,
    protected asmComponentService: AsmComponentService,
    protected globalMessageService: GlobalMessageService,
    protected routingService: RoutingService,
    protected asmService: AsmService,
    protected userAccountFacade: UserAccountFacade,
    protected launchDialogService: LaunchDialogService
  ) {}

  ngOnInit(): void {
    this.customerSupportAgentLoggedIn$ = this.csAgentAuthService
      .isCustomerSupportAgentLoggedIn()
      .pipe(
        distinctUntilChanged(),
        tap((loggedIn) => {
          if (!loggedIn) {
            this.closeModal();
          }
        })
      );

    this.csAgentTokenLoading$ =
      this.csAgentAuthService.getCustomerSupportAgentTokenLoading();
    this.customer$ = this.authService.isUserLoggedIn().pipe(
      switchMap((isLoggedIn) => {
        if (isLoggedIn) {
          this.handleCustomerSessionStartRedirection();
          return this.userAccountFacade.get();
        } else {
          return of(undefined);
        }
      })
    );
    this.isCollapsed$ = this.asmService
      .getAsmUiState()
      .pipe(
        map((uiState: AsmUi) =>
          uiState.collapsed === undefined ? false : uiState.collapsed
        )
      );
    this.subscription.add(
      this.launchDialogService.dialogClose
        .pipe(filter((result) => Boolean(result)))
        .subscribe((result: CustomerListAction | User | string) => {
          if (typeof result !== 'string') {
            if ('selectedUser' in result) {
              this.startCustomerEmulationSession(result.selectedUser);
              if (
                result.actionType === CustomerListColumnActionType.ORDER_HISTORY
              ) {
                this.routingService.go({ cxRoute: 'orders' });
              }
            } else if ('customerId' in result) {
              this.startCustomerEmulationSession({
                customerId: result.customerId,
              });
              this.showCreateCustomerSuccessfullyAlert = true;
              this.routingService.go('/');
            }
            if (
              'actionType' in result &&
              result.actionType === CustomerListColumnActionType.ACTIVE_CART
            ) {
              this.routingService.go({ cxRoute: 'cart' });
            }
          }
        })
    );
    this.subscribeForDeeplink();
  }

  /**
   * When agent is logged in and deep link has customerID,
   * call logout if has customer emulated(userLoggedin) but not emulated by deep link.
   * call startSessionWithParameters
   */
  protected subscribeForDeeplink(): void {
    if (this.asmComponentService.isEmulateInURL()) {
      //Always route to home page to avoid 404
      this.routingService.go('/');
    }
    const parameters = this.asmComponentService.getDeepLinkUrlParams() ?? {
      customerId: this.asmComponentService.getSearchParameter('customerId'),
      orderId: this.asmComponentService.getSearchParameter('orderId'),
      ticketId: this.asmComponentService.getSearchParameter('ticketId'),
      cartId: this.asmComponentService.getSearchParameter('cartId'),
      cartType: this.asmComponentService.getSearchParameter('cartType'),
      emulated: false,
    };
    this.deeplinkCartAlertKey = CART_TYPE_KEY[parameters.cartType || ''];
    this.subscription.add(
      combineLatest([
        this.customerSupportAgentLoggedIn$,
        this.authService.isUserLoggedIn(),
        this.asmComponentService.isEmulatedByDeepLink(),
      ]).subscribe(([agentLoggedIn, userLoggedin, isEmulatedByDeepLink]) => {
        if (agentLoggedIn && parameters.customerId) {
          if (!isEmulatedByDeepLink && userLoggedin) {
            this.confirmSwitchCustomer(parameters.customerId);
          } else {
            setTimeout(() =>
              this.startSessionWithParameters({
                ...parameters,
                emulated: isEmulatedByDeepLink,
              })
            );
          }
        }
      })
    );
  }

  protected confirmSwitchCustomer(switchCustomerId: string): void {
    this.customer$
      .pipe(
        filter((curCustomer) => !!curCustomer),
        take(1)
      )
      .subscribe((curCustomer) => {
        if (curCustomer?.customerId !== switchCustomerId) {
          this.userAccountFacade.getById(switchCustomerId).subscribe({
            next: (switchCustomer) => {
              this.launchDialogService.openDialogAndSubscribe(
                LAUNCH_CALLER.ASM_SWITCH_CUSTOMER,
                this.element,
                { curCustomer: curCustomer, switchCustomer: switchCustomer }
              );
            },
            error: (error: HttpErrorModel) => {
              this.globalMessageService.add(
                error.details?.[0].message ?? '',
                GlobalMessageType.MSG_TYPE_ERROR
              );
            },
          });
        } else {
          this.asmComponentService.setEmulatedByDeepLink(true);
        }
      });
  }

  /**
   * If url contains customerId and we haven't emulatedFromURL, we'll change the isEmulatedByDeepLink flag and
   * start emulate customer in URL.
   */
  protected startSessionWithParameters(parameters: any): void {
    if (!parameters.emulated) {
      this.asmComponentService.setEmulatedByDeepLink(true);
      this.startCustomerEmulationSession(
        {
          customerId: parameters.customerId,
        },
        parameters
      );
    }
  }

  protected handleCustomerSessionStartRedirection(): void {
    this.asmComponentService
      .isCustomerEmulationSessionInProgress()
      .pipe(take(1))
      .subscribe((isCustomerEmulated) => {
        if (this.startingCustomerSession && isCustomerEmulated) {
          this.startingCustomerSession = false;
          this.globalMessageService.remove(GlobalMessageType.MSG_TYPE_ERROR);
          this.routingService.go('/');
        }
      });
  }

  loginCustomerSupportAgent({
    userId,
    password,
  }: {
    userId: string;
    password: string;
  }): void {
    this.csAgentAuthService.authorizeCustomerSupportAgent(userId, password);
  }

  logout(): void {
    this.asmComponentService.logoutCustomerSupportAgentAndCustomer();
  }

  startCustomerEmulationSession(
    { customerId }: { customerId?: string },
    parameters?: AsmDeepLinkParameters
  ): void {
    if (customerId) {
      this.csAgentAuthService.startCustomerEmulationSession(customerId);
      this.startingCustomerSession = true;
      this.showCustomerEmulationInfoAlert = true;
      this.showCreateCustomerSuccessfullyAlert = false;
      if (parameters) {
        this.asmComponentService.handleDeepLinkNavigation({
          customerId,
          ...parameters,
        });
      }
    } else {
      this.globalMessageService.add(
        { key: 'asm.error.noCustomerId' },
        GlobalMessageType.MSG_TYPE_ERROR
      );
    }
  }

  hideUi(): void {
    this.disabled = true;
    this.asmComponentService.unload();
  }

  showCustomList(): void {
    this.launchDialogService.openDialogAndSubscribe(
      LAUNCH_CALLER.ASM_CUSTOMER_LIST,
      this.element
    );
  }

  closeModal(): void {
    this.launchDialogService.closeDialog('logout');
  }

  createCustomer(): void {
    this.launchDialogService?.openDialogAndSubscribe(
      LAUNCH_CALLER.ASM_CREATE_CUSTOMER_FORM,
      this.addNewCustomerLink
    );
  }

  closeDialogConfirmationAlert(): void {
    this.showCreateCustomerSuccessfullyAlert = false;
  }

  closeDeeplinkCartInfoAlert(): void {
    this.asmComponentService.setShowDeeplinkCartInfoAlert(false);
  }

  closeCustomerEmulationInfoAlert(): void {
    this.showCustomerEmulationInfoAlert = false;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
