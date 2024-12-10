/*
 * SPDX-FileCopyrightText: 2024 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
} from '@angular/core';

@Directive({
  selector: '[buttonAdded]',
})
export class DomChangeDirective implements OnDestroy {
  private changes: MutationObserver;

  @Output()
  public buttonAdded = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    this.changes = new MutationObserver((mutations: MutationRecord[]) => {
      mutations
        .filter((mutation) => mutation.target?.nodeName === 'BUTTON')
        .forEach((mutation) => this.buttonAdded.emit(mutation));
    });

    this.changes.observe(this.elementRef.nativeElement, {
      subtree: true,
      childList: true,
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
