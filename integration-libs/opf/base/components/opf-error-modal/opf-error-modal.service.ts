/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, inject } from '@angular/core';
import { TranslationService } from '@spartacus/core';
import {
  OpfErrorDialogOptions,
  defaultOpfErrorDialogOptions,
} from '@spartacus/opf/base/root';
import { combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OpfErrorModalService {
  protected translationService = inject(TranslationService);

  getMessageAndConfirmTranslations(dialogOptions: OpfErrorDialogOptions) {
    return combineLatest([
      this.getLabelTranslation(
        defaultOpfErrorDialogOptions.messageKey as string,
        dialogOptions.messageString,
        dialogOptions.messageKey,
        dialogOptions.messageReplacements
      ),
      this.getLabelTranslation(
        defaultOpfErrorDialogOptions.confirmKey as string,
        dialogOptions.confirmString,
        dialogOptions.confirmKey,
        dialogOptions.confirmReplacements
      ),
    ]).pipe(
      map((labelArray) => {
        return { message: labelArray[0], confirm: labelArray[1] };
      })
    );
  }

  protected getLabelTranslation(
    defaultKey: string,
    labelString?: string,
    labelKey?: string,
    labelReplacements?: any
  ) {
    const defaultLabel$ = this.translationService.translate(defaultKey);

    if (labelString) {
      return of(labelString);
    } else if (labelKey) {
      const labelFromKey$ = this.translationService
        .translate(labelKey)
        .pipe(switchMap((val) => (val ? of(val) : defaultLabel$)));

      if (labelReplacements) {
        return this.translationService
          .translate(labelKey, labelReplacements)
          .pipe(switchMap((val) => (val ? of(val) : labelFromKey$)));
      } else {
        return labelFromKey$;
      }
    } else {
      return defaultLabel$;
    }
  }
}
