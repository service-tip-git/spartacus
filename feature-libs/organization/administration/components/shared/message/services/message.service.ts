/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { GlobalMessageType } from '@spartacus/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { MessageData, MessageEventData } from '../message.model';

const DEFAULT_INFO_TIMEOUT = 3000;

@Injectable()
export class MessageService<
  O extends MessageEventData = MessageEventData,
  T extends MessageData<O> = MessageData<O>
> {
  protected data$: ReplaySubject<T | undefined> = new ReplaySubject();

  get(): Observable<T | undefined> {
    return this.data$;
  }

  add(message: T): Subject<O> {
    message = { ...this.getDefaultMessage(message), ...message };
    message.events = new Subject<O>();
    this.data$.next(message);
    return message.events;
  }

  close(message: Subject<MessageEventData> | null) {
    message?.next({ close: true });
  }

  /**
   * Sets the message type to INFO, and adds a default timeout
   * for info messages.
   */
  protected getDefaultMessage(message: T): MessageData {
    const defaultMessage: MessageData = {
      type: GlobalMessageType.MSG_TYPE_INFO,
    };
    if (
      !message.type ||
      (message.type === GlobalMessageType.MSG_TYPE_INFO && !message.timeout)
    ) {
      defaultMessage.timeout = DEFAULT_INFO_TIMEOUT;
    }
    return defaultMessage;
  }

  clear(): void {
    this.data$.next(undefined);
  }
}
