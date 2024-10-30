/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@spartacus/core';
import {
  FileUploadModule,
  FormErrorsModule,
  IconModule,
  KeyboardFocusModule,
} from '@spartacus/storefront';
import { CustomerTicketingCreateDialogComponent } from './customer-ticketing-create-dialog/customer-ticketing-create-dialog.component';
import { CustomerTicketingCreateComponent } from './customer-ticketing-create.component';
import { FeaturesConfigModule } from '@spartacus/core';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    IconModule,
    KeyboardFocusModule,
    ReactiveFormsModule,
    FormErrorsModule,
    FileUploadModule,
    FeaturesConfigModule,
  ],
  declarations: [
    CustomerTicketingCreateComponent,
    CustomerTicketingCreateDialogComponent,
  ],
  exports: [
    CustomerTicketingCreateComponent,
    CustomerTicketingCreateDialogComponent,
  ],
})
export class CustomerTicketingCreateModule {}
