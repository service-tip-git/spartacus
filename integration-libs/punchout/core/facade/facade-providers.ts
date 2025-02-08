import { Provider } from '@angular/core';
import { PunchoutFacade } from '@spartacus/punchout/root';
import { PunchoutService } from './punchout.service';

export const facadeProviders: Provider[] = [
  PunchoutService,
  {
    provide: PunchoutFacade,
    useExisting: PunchoutService,
  },
];
