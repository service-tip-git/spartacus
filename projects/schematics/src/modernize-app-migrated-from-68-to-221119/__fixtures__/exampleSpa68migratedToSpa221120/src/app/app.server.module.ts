import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { provideServer } from '@spartacus/setup/ssr';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    ...provideServer({
       serverRequestOrigin: process.env['SERVER_REQUEST_ORIGIN'],
     }),
  ],
})
export class AppServerModule {}
