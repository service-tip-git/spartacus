/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  afterNextRender,
  AfterViewChecked,
  Component,
  inject,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PunchoutRequisition } from '@spartacus/punchout/root';
import { mergeMap, Observable, of, retry, throwError, timer } from 'rxjs';
import { PunchoutComponentService } from '../punchout.component.service';

@Component({
  selector: 'cx-punchout-requsition',
  templateUrl: './punchout-requisition.component.html',
  standalone: false,
})
export class PunchoutRequisitionComponent
  implements OnInit, OnChanges, AfterViewChecked
{
  @ViewChild('pchtForm') pchtForm: HTMLFormElement;

  protected punchoutService = inject(PunchoutComponentService);

  constructor() {
    afterNextRender(() => {
      console.log('in afterNextRender');
    });
  }

  // punchoutRequisition$: PunchoutRequisition;
  punchoutRequisition$: Observable<PunchoutRequisition> =
    this.punchoutService.getPunchoutRequisition();

  ngOnInit(): void {
    console.log('PunchoutRequisitionComponent ngOninit');
  }

  ngOnChanges(changes?: SimpleChanges): void {
    console.log('ngOnChanges:', changes?.item);
    if (changes?.item) {
      console.log('in condition:', changes?.item);
    }
  }

  afterRender() {}

  ngAfterViewChecked() {
    console.log('This runs after every view change detection cycle');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    timer(100)
      .pipe(
        mergeMap(() => {
          if (!this.pchtForm?.nativeElement) {
            console.log('Form is null');
            return throwError(() => 'Form not ready');
          } else {
            return of(true);
          }
        }),
        retry(10)
      )
      .subscribe(() => {
        this.pchtForm.nativeElement.submit();
      });

    // timer(2000).subscribe(() => {
    //   console.log('ngAfterViewInit2', this.pchtForm);
    //   // this.pchtForm.ngSubmit.emit(this.pchtForm.value);
    //   // this.pchtForm.onSubmit()
    //   this.pchtForm.nativeElement.submit();
    // });
  }

  onCxmlInputValueChange(value?: string) {
    console.log('onCxmlInputValueChange', value);
    if (value) {
      this.pchtForm.ngSubmit;
    }
  }
}
