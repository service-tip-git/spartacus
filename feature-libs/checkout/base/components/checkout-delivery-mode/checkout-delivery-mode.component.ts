/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  Optional,
  inject,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ActiveCartFacade, CartOutlets } from '@spartacus/cart/base/root';
import { CheckoutDeliveryModesFacade } from '@spartacus/checkout/base/root';
import {
  FeatureConfigService,
  GlobalMessageService,
  GlobalMessageType,
} from '@spartacus/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { CheckoutConfigService } from '../services/checkout-config.service';
import { CheckoutStepService } from '../services/checkout-step.service';
import { NgIf, NgTemplateOutlet, NgFor, AsyncPipe } from '@angular/common';
import { FeatureDirective } from '../../../../../projects/core/src/features-config/directives/feature.directive';
import { OutletDirective } from '../../../../../projects/storefrontlib/cms-structure/outlet/outlet.directive';
import { SpinnerComponent } from '../../../../../projects/storefrontlib/shared/components/spinner/spinner.component';
import { InnerComponentsHostDirective } from '../../../../../projects/storefrontlib/cms-structure/page/component/inner-components-host.directive';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';

@Component({
  selector: 'cx-delivery-mode',
  templateUrl: './checkout-delivery-mode.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    NgTemplateOutlet,
    FeatureDirective,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    OutletDirective,
    SpinnerComponent,
    InnerComponentsHostDirective,
    AsyncPipe,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class CheckoutDeliveryModeComponent {
  protected globalMessageService = inject(GlobalMessageService);
  protected busy$ = new BehaviorSubject(false);
  protected readonly isSetDeliveryModeHttpErrorSub = new BehaviorSubject(false);

  readonly CartOutlets = CartOutlets;

  @Optional() featureConfigService = inject(FeatureConfigService, {
    optional: true,
  });

  isSetDeliveryModeHttpError$ =
    this.isSetDeliveryModeHttpErrorSub.asObservable();

  selectedDeliveryModeCode$ = this.checkoutDeliveryModesFacade
    .getSelectedDeliveryModeState()
    .pipe(
      filter((state) => !state.loading),
      map((state) => state.data),
      map((deliveryMode) => deliveryMode?.code)
    );

  supportedDeliveryModes$ = this.checkoutDeliveryModesFacade
    .getSupportedDeliveryModes()
    .pipe(
      filter((deliveryModes) => !!deliveryModes?.length),
      withLatestFrom(this.selectedDeliveryModeCode$),
      tap(([deliveryModes, code]) => {
        if (
          !code ||
          !deliveryModes.find((deliveryMode) => deliveryMode.code === code)
        ) {
          code =
            this.checkoutConfigService.getPreferredDeliveryMode(deliveryModes);
        }
        if (code) {
          this.mode.controls['deliveryModeId'].setValue(code);
          this.changeMode(code);
        }
      }),
      map(([deliveryModes]) =>
        deliveryModes.filter((mode) => mode.code !== 'pickup')
      )
    );

  backBtnText = this.checkoutStepService.getBackBntText(this.activatedRoute);

  mode: UntypedFormGroup = this.fb.group({
    deliveryModeId: ['', Validators.required],
  });

  isUpdating$: Observable<boolean> = combineLatest([
    this.busy$,
    this.checkoutDeliveryModesFacade
      .getSelectedDeliveryModeState()
      .pipe(map((state) => state.loading)),
  ]).pipe(
    map(([busy, loading]) => busy || loading),
    distinctUntilChanged()
  );

  get deliveryModeInvalid(): boolean {
    return this.mode.controls['deliveryModeId'].invalid;
  }

  constructor(
    protected fb: UntypedFormBuilder,
    protected checkoutConfigService: CheckoutConfigService,
    protected activatedRoute: ActivatedRoute,
    protected checkoutStepService: CheckoutStepService,
    protected checkoutDeliveryModesFacade: CheckoutDeliveryModesFacade,
    protected activeCartFacade: ActiveCartFacade
  ) {}

  changeMode(code: string | undefined, event?: Event): void {
    if (!code) {
      return;
    }
    const lastFocusedId = (<HTMLElement>event?.target)?.id;
    this.busy$.next(true);
    this.checkoutDeliveryModesFacade.setDeliveryMode(code).subscribe({
      complete: () => this.onSuccess(),
      error: () => this.onError(),
    });

    // TODO: (CXSPA-6599) - Remove feature flag next major release
    if (this.featureConfigService?.isEnabled('a11yCheckoutDeliveryFocus')) {
      const isTriggeredByKeyboard = (<MouseEvent>event)?.screenX === 0;
      if (isTriggeredByKeyboard) {
        this.restoreFocus(lastFocusedId, code);
        return;
      }
      this.mode.setValue({ deliveryModeId: code });
    }
  }

  next(): void {
    this.checkoutStepService.next(this.activatedRoute);
  }

  back(): void {
    this.checkoutStepService.back(this.activatedRoute);
  }

  getAriaChecked(code: string | undefined): boolean {
    return code === this.mode.controls['deliveryModeId'].value;
  }

  protected onSuccess(): void {
    this.isSetDeliveryModeHttpErrorSub.next(false);
    this.busy$.next(false);
  }

  protected onError(): void {
    this.globalMessageService?.add(
      { key: 'setDeliveryMode.unknownError' },
      GlobalMessageType.MSG_TYPE_ERROR
    );

    this.isSetDeliveryModeHttpErrorSub.next(true);
    this.busy$.next(false);
  }

  /**
   * Restores focus after data is updated.
   */
  protected restoreFocus(lastFocusedId: string, code: string): void {
    this.isUpdating$
      .pipe(
        filter((isUpdating) => !isUpdating),
        take(1)
      )
      .subscribe(() => {
        setTimeout(() => {
          document.querySelector('main')?.classList.remove('mouse-focus');
          this.mode.setValue({ deliveryModeId: code });
          document.getElementById(lastFocusedId)?.focus();
        }, 0);
      });
  }
}
