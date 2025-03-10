/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Provider } from '@angular/core';
import { ComponentDecorator, SlotDecorator } from '@spartacus/core';
import { SmartEditComponentDecorator } from './smart-edit-component-decorator';
import { SmartEditSlotDecorator } from './smart-edit-slot-decorator';

export const smartEditDecorators: Provider[] = [
  {
    provide: ComponentDecorator,
    useExisting: SmartEditComponentDecorator,
    multi: true,
  },
  {
    provide: SlotDecorator,
    useExisting: SmartEditSlotDecorator,
    multi: true,
  },
];
