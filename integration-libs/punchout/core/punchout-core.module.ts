import { NgModule } from '@angular/core';
import { PunchoutConnector } from './connectors';
import { facadeProviders } from './facade/facade-providers';

@NgModule({
  imports: [],
  providers: [...facadeProviders, PunchoutConnector],
})
export class PunchoutCoreModule {}
