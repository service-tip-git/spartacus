import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { provideDefaultConfig } from '@spartacus/core';
import { PunchoutComponent } from '../components';
import { defaultPunchoutRoutingConfig } from './config/default-punchout-routing-config';

const routes: Routes = [
  {
    // @ts-ignore
    path: null,
    component: PunchoutComponent,
    data: {
      cxRoute: 'punchoutSession',
    },
    // loadChildren: () =>
    //   import('../components').then((m) => m.PunchoutModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [provideDefaultConfig(defaultPunchoutRoutingConfig)],
})
export class PunchoutRootModule {}
