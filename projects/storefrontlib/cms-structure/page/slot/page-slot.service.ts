/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DeferLoadingStrategy } from '@spartacus/core';
import { IntersectionOptions } from '../../../layout/loading/intersection.model';
import { CmsComponentsService } from '../../services/cms-components.service';

@Injectable({
  providedIn: 'root',
})
export class PageSlotService {
  protected prerenderedSlots: (string | null)[] | undefined;

  constructor(
    protected cmsComponentsService: CmsComponentsService,
    @Inject(PLATFORM_ID) protected platformId: any,
    @Inject(DOCUMENT) protected document: Document
  ) {
    this.resolvePrerenderedSlots();
  }

  /**
   * Finds all slots visible in the SSR pre-rendered DOM
   */
  protected resolvePrerenderedSlots(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.prerenderedSlots = Array.from(
        this.document.querySelectorAll('cx-page-slot')
      )
        .filter(
          (el: Element) =>
            el.getBoundingClientRect().top <
            this.document.documentElement.clientHeight
        )
        .map((el: Element) => el.getAttribute('position'));
    }
  }

  /**
   * Indicates if certain slot should be rendered instantly.
   *
   * It's especially useful when transitioning from SSR to CSR application,
   * where we don't want to apply deferring logic to slots that are visible
   * to avoid unnecessary flickering.
   */
  shouldNotDefer(slot: string): boolean {
    if (this.prerenderedSlots?.includes(slot)) {
      this.prerenderedSlots.splice(this.prerenderedSlots.indexOf(slot), 1);
      return true;
    }
    return false;
  }

  /**
   * Returns the defer options for the given component. If the wrapping
   * page slot is prerendered, we would ignore the defer options altogether.
   */
  getComponentDeferOptions(
    slot: string | undefined,
    componentType: string
  ): IntersectionOptions {
    if (slot && this.shouldNotDefer(slot)) {
      return { deferLoading: DeferLoadingStrategy.INSTANT };
    }
    const deferLoading =
      this.cmsComponentsService.getDeferLoadingStrategy(componentType);
    return { deferLoading };
  }
}
