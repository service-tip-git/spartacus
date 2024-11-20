/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  EntitiesModel,
  RoutingService,
  SearchConfig,
  TranslationService,
  useFeatureStyles,
} from '@spartacus/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderApproval } from '../../core/model/order-approval.model';
import { OrderApprovalService } from '../../core/services/order-approval.service';
import { MockDatePipe } from '../../../../../projects/core/src/i18n/testing/mock-date.pipe';
import { MockTranslatePipe } from '../../../../../projects/core/src/i18n/testing/mock-translate.pipe';
import { CxDatePipe } from '../../../../../projects/core/src/i18n/date.pipe';
import { TranslatePipe } from '../../../../../projects/core/src/i18n/translate.pipe';
import { UrlPipe } from '../../../../../projects/core/src/routing/configurable-routes/url-translation/url.pipe';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../../../projects/storefrontlib/shared/components/list-navigation/pagination/pagination.component';
import { SortingComponent } from '../../../../../projects/storefrontlib/shared/components/list-navigation/sorting/sorting.component';
import { FeatureDirective } from '../../../../../projects/core/src/features-config/directives/feature.directive';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'cx-order-approval-list',
  templateUrl: './order-approval-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    FeatureDirective,
    SortingComponent,
    PaginationComponent,
    NgFor,
    RouterLink,
    AsyncPipe,
    UrlPipe,
    TranslatePipe,
    CxDatePipe,
    MockTranslatePipe,
    MockDatePipe,
  ],
})
export class OrderApprovalListComponent implements OnInit {
  constructor(
    protected routing: RoutingService,
    protected orderApprovalService: OrderApprovalService,
    protected translation: TranslationService
  ) {
    useFeatureStyles('a11yShowLabelOfSelect');
  }

  sortLabels$: Observable<{ byDate: string; byOrderNumber: string }>;
  protected PAGE_SIZE = 5;
  sortType: string;

  orderApprovals$: Observable<EntitiesModel<OrderApproval> | undefined>;

  ngOnInit(): void {
    this.fetchApprovalListPage({});
    this.sortLabels$ = combineLatest([
      this.translation.translate('sorting.date'),
      this.translation.translate('sorting.orderNumber'),
    ]).pipe(
      map(([textByDate, textByOrderNumber]) => {
        return {
          byDate: textByDate,
          byOrderNumber: textByOrderNumber,
        };
      })
    );
  }

  changeSortCode(sortCode: string): void {
    const fetchParams: SearchConfig = {
      sort: sortCode,
      currentPage: 0,
    };
    this.sortType = sortCode;
    this.fetchApprovalListPage(fetchParams);
  }

  pageChange(page: number): void {
    const fetchParams: SearchConfig = {
      sort: this.sortType,
      currentPage: page,
    };
    this.fetchApprovalListPage(fetchParams);
  }

  protected fetchApprovalListPage(searchConfig: SearchConfig): void {
    searchConfig.pageSize = this.PAGE_SIZE;
    this.orderApprovalService.loadOrderApprovals(searchConfig);
    this.orderApprovals$ = this.orderApprovalService.getList(searchConfig);
  }

  goToApprovalDetails(event: any, orderApproval: OrderApproval): void {
    if (event?.target?.nodeName.toLowerCase() !== 'a') {
      this.routing.go({
        cxRoute: 'orderApprovalDetails',
        params: { approvalCode: orderApproval.code },
      });
    }
  }
}
