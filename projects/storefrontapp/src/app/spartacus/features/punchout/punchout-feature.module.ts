import { NgModule } from '@angular/core';
import { provideConfig } from '@spartacus/core';
import { PUNCHOUT_FEATURE, PunchoutRootModule } from '@spartacus/punchout/root';

@NgModule({
  imports: [PunchoutRootModule],
  providers: [
    provideConfig({
      featureModules: {
        [PUNCHOUT_FEATURE]: {
          module: () =>
            import('@spartacus/punchout').then((m) => m.PunchoutModule),
        },
      },
    }),
  ],
})
export class PunchoutFeatureModule {}
