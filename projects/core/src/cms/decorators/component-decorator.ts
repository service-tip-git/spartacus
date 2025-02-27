/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable, Renderer2 } from '@angular/core';
import { ContentSlotComponentData } from '../model/content-slot-component-data.model';

@Injectable()
export abstract class ComponentDecorator {
  /**
   * Add attributes to CMS Component element dynamically
   * @param element: CMS component element
   * @param renderer
   * @param component: CMS component data
   */
  abstract decorate(
    element: Element,
    renderer: Renderer2,
    component?: ContentSlotComponentData
  ): void;
}
