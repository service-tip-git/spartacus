import { NgModule } from '@angular/core';
import { CmsConfig, provideDefaultConfig } from '@spartacus/core';
import { PunchoutSessionComponent } from './punchout-session/punchout-session.component';
import { PunchoutComponentService } from './punchout.component.service';

@NgModule({
  declarations: [PunchoutSessionComponent],
  exports: [PunchoutSessionComponent],
  providers: [
    PunchoutComponentService,
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        PunchoutSessionComponent: {
          component: PunchoutSessionComponent,
        },
      },
    }),
  ],
})
export class PunchoutComponentsModule {}
