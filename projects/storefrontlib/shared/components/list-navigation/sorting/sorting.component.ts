/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SortModel } from '@spartacus/core';
import { NgSelectComponent, NgOptionComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgSelectA11yDirective } from '../../ng-select-a11y/ng-select-a11y.directive';
import { NgFor } from '@angular/common';
import { TranslatePipe } from '../../../../../core/src/i18n/translate.pipe';
import { MockTranslatePipe } from '../../../../../core/src/i18n/testing/mock-translate.pipe';

@Component({
  selector: 'cx-sorting',
  templateUrl: './sorting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgSelectComponent,
    FormsModule,
    NgSelectA11yDirective,
    NgFor,
    NgOptionComponent,
    TranslatePipe,
    MockTranslatePipe,
  ],
})
export class SortingComponent {
  @Input()
  sortOptions: SortModel[] | undefined;
  @Input()
  ariaControls: string;
  @Input()
  ariaLabel: string | undefined;
  @Input()
  selectedOption: string | undefined;
  @Input()
  placeholder: string;
  @Input()
  sortLabels: { [code: string]: string } | null;

  @Output()
  sortListEvent: EventEmitter<string>;

  constructor() {
    this.sortListEvent = new EventEmitter<string>();
  }

  sortList(sortCode: string): void {
    this.sortListEvent.emit(sortCode);
  }

  get selectedLabel() {
    if (this.selectedOption) {
      return (
        this.sortOptions?.find((sort) => sort.code === this.selectedOption)
          ?.name ?? this.sortLabels?.[this.selectedOption]
      );
    }
  }
}
