import { NgModule } from '@angular/core';
import { CmsConfig, provideDefaultConfigFactory } from '@spartacus/core';
import { PUNCHOUT_FEATURE } from './feature-name';

// const routes: Routes = [
//   {
//     // @ts-ignore
//     path: null,
//     component: PunchoutComponent,
//     data: {
//       cxRoute: 'punchoutSession',
//     },
//     // loadChildren: () =>
//     //   import('../components').then((m) => m.PunchoutModule),
//   },
// ];
// need a module that loads:
// punchout interceptor
// import config in chareg of overwriting AddToCart Component

export function defaultPunchoutCmsComponentsConfig(): CmsConfig {
  const config: CmsConfig = {
    featureModules: {
      [PUNCHOUT_FEATURE]: {
        cmsComponents: ['PunchoutComponent'],
      },
    },
  };
  return config;
}

@NgModule({
  providers: [provideDefaultConfigFactory(defaultPunchoutCmsComponentsConfig)],
})
export class PunchoutRootModule {}
