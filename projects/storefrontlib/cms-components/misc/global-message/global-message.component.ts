/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, OnInit } from '@angular/core';
import {
  GlobalMessageEntities,
  GlobalMessageService,
  GlobalMessageType,
} from '@spartacus/core';
import { Observable } from 'rxjs';
import { ICON_TYPE } from '../../../cms-components/misc/icon/icon.model';

@Component({
  selector: 'cx-global-message',
  templateUrl: './global-message.component.html',
  standalone: false,
})
export class GlobalMessageComponent implements OnInit {
  iconTypes = ICON_TYPE;

  messages$: Observable<GlobalMessageEntities>;
  messageType: typeof GlobalMessageType = GlobalMessageType;

  constructor(protected globalMessageService: GlobalMessageService) {}

  ngOnInit(): void {
    this.messages$ = this.globalMessageService.get();
  }

  clear(type: GlobalMessageType, index: number): void {
    this.globalMessageService.remove(type, index);
  }
}
