/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nModule, UrlModule } from '@spartacus/core';
import { IconModule } from '@spartacus/storefront';
import { CartValidationWarningsComponent } from './cart-validation-warnings.component';

@NgModule({
    imports: [CommonModule, RouterModule, I18nModule, UrlModule, IconModule, CartValidationWarningsComponent],
    exports: [CartValidationWarningsComponent],
})
export class CartValidationWarningsModule {}
