import { Injectable } from '@angular/core';
import { Config } from '@spartacus/core';

@Injectable({
  providedIn: 'root',
  useExisting: Config,
})
export abstract class OpfQuickBuyConfig {
  googlePayApiUrl?: string;
}

declare module '@spartacus/core' {
  interface Config extends OpfQuickBuyConfig {}
}
