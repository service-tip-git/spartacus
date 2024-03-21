/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  CmsConfig,
  FeaturesConfigModule,
  I18nModule,
  provideDefaultConfig,
} from '@spartacus/core';
import { FormErrorsModule, StarRatingModule } from '../../../../shared/index';
import { ProductReviewsComponent } from './product-reviews.component';
import { IconModule } from "../../../misc/icon/icon.module";

@NgModule({
    providers: [
        provideDefaultConfig(<CmsConfig>{
            cmsComponents: {
                ProductReviewsTabComponent: {
                    component: ProductReviewsComponent,
                },
            },
        }),
    ],
    declarations: [ProductReviewsComponent],
    exports: [ProductReviewsComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        I18nModule,
        StarRatingModule,
        FormErrorsModule,
        FeaturesConfigModule,
        IconModule
    ]
})
export class ProductReviewsModule {}
