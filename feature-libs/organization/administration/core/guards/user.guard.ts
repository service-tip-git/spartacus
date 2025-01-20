/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, Injector } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import {
  GlobalMessageService,
  GlobalMessageType,
  SemanticPathService,
} from '@spartacus/core';
import { B2BUserService } from '../services';

let UserGuard_count = 0;

@Injectable()
export class UserGuard {
  UserGuard_count = ++UserGuard_count;

  constructor(
    protected globalMessageService: GlobalMessageService,
    protected b2bUserService: B2BUserService,
    protected semanticPathService: SemanticPathService,
    protected router: Router,
    protected injector: Injector
  ) {
    console.log({
      UserGuard: this,
    });
  }

  canActivate(): boolean | UrlTree {
    const isUpdatingUserAllowed = this.b2bUserService.isUpdatingUserAllowed();
    if (!isUpdatingUserAllowed) {
      this.globalMessageService.add(
        { key: 'organization.notification.notExist' },
        GlobalMessageType.MSG_TYPE_WARNING
      );
      return this.router.parseUrl(
        this.semanticPathService.get('organization') ?? ''
      );
    }
    return isUpdatingUserAllowed;
  }
}
