/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DpLocalStorageService } from '../../../facade/dp-local-storage.service';
import {
  GlobalMessageService,
  GlobalMessageType,
  WindowRef,
} from '@spartacus/core';
import { DpCheckoutPaymentService } from '../../../facade';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cx-dp-payment-form',
  templateUrl: './dp-payment-form.component.html',
  standalone: false,
})
export class DpPaymentFormComponent implements OnInit {
  @Output()
  closeForm = new EventEmitter<any>();

  constructor(
    private dpPaymentService: DpCheckoutPaymentService,
    private dpStorageService: DpLocalStorageService,
    private globalMsgService: GlobalMessageService,
    private winRef: WindowRef
  ) {}

  ngOnInit(): void {
    this.dpPaymentService.getCardRegistrationDetails().subscribe((request) => {
      if (request?.url) {
        this.dpStorageService.syncCardRegistrationState(request);
        this.redirect(request.url);
      } else if (request) {
        this.globalMsgService.add(
          { key: 'dpPaymentForm.error.redirect' },
          GlobalMessageType.MSG_TYPE_ERROR
        );
        this.closeForm.emit();
      }
    });
  }

  redirect(url: string) {
    const window = this.winRef.nativeWindow;

    if (window?.location) {
      window.location.href = url;
    }
  }
}
