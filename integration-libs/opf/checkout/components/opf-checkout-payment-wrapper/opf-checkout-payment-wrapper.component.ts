/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';
import {
  GlobalFunctionsDomain,
  OpfGlobalFunctionsFacade,
} from '@spartacus/opf/global-functions/root';
import {
  OpfPaymentRenderPattern,
  OpfPaymentSessionData,
} from '@spartacus/opf/payment/root';
import { Subscription } from 'rxjs';
import { OpfCheckoutPaymentWrapperService } from './opf-checkout-payment-wrapper.service';

@Component({
  selector: 'cx-opf-checkout-payment-wrapper',
  templateUrl: './opf-checkout-payment-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpfCheckoutPaymentWrapperComponent implements OnInit, OnDestroy {
  @Input() selectedPaymentId: number;

  renderPaymentMethodEvent$ = this.service.getRenderPaymentMethodEvent();

  RENDER_PATTERN = OpfPaymentRenderPattern;

  sub: Subscription = new Subscription();

  constructor(
    protected service: OpfCheckoutPaymentWrapperService,
    protected sanitizer: DomSanitizer,
    protected globalFunctionsService: OpfGlobalFunctionsFacade,
    protected vcr: ViewContainerRef
  ) {}

  renderHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  renderUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnInit() {
    this.initiatePaymentMode();
  }

  ngOnDestroy() {
    this.globalFunctionsService.removeGlobalFunctions(
      GlobalFunctionsDomain.CHECKOUT
    );
    this.sub.unsubscribe();
  }

  retryInitiatePayment(): void {
    this.service.reloadPaymentMode();
  }

  protected initiatePaymentMode(): void {
    this.sub.add(
      this.service.initiatePayment(this.selectedPaymentId).subscribe({
        next: (paymentSessionData) => {
          if (this.isHostedFields(paymentSessionData)) {
            this.globalFunctionsService.registerGlobalFunctions({
              domain: GlobalFunctionsDomain.CHECKOUT,
              paymentSessionId: (paymentSessionData as OpfPaymentSessionData)
                .paymentSessionId as string,
              vcr: this.vcr,
            });
          } else {
            this.globalFunctionsService.removeGlobalFunctions(
              GlobalFunctionsDomain.CHECKOUT
            );
          }
        },
      })
    );
  }

  protected isHostedFields(
    paymentSessionData: OpfPaymentSessionData | Error
  ): boolean {
    return !!(
      !(paymentSessionData instanceof Error) &&
      paymentSessionData?.paymentSessionId &&
      paymentSessionData?.pattern === OpfPaymentRenderPattern.HOSTED_FIELDS
    );
  }
}
