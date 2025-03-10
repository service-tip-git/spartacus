/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Component, Input, NgModule } from '@angular/core';
import { ListService } from '../list/list.service';

@Component({
  selector: 'cx-org-sub-list',
  template: '',
  standalone: false,
})
class MockSubListComponent {
  @Input() i18nRoot;
}

class MockListService {}

@NgModule({
  declarations: [MockSubListComponent],
  exports: [MockSubListComponent],
  providers: [
    {
      provide: ListService,
      useClass: MockListService,
    },
  ],
})
export class SubListTestingModule {}
