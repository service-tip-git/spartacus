import { NgModule } from '@angular/core';
import { CmsConfig, provideDefaultConfig } from '@spartacus/core';
import { PunchoutComponent } from './punchout.component';
import { PunchoutComponentService } from './punchout.component.service';

@NgModule({
  declarations: [PunchoutComponent],
  exports: [PunchoutComponent],
  providers: [
    PunchoutComponentService,
    provideDefaultConfig(<CmsConfig>{
      cmsComponents: {
        PunchoutComponent: {
          component: PunchoutComponent,
        },
      },
    }),
  ],
})
export class PunchoutComponentsModule {}
