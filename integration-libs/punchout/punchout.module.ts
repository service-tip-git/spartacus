import { NgModule } from '@angular/core';
import { PunchoutComponentsModule } from './components';
import { PunchoutCoreModule } from './core/punchout-core.module';
import { PunchoutOccModule } from './occ/punchout-occ.module';

@NgModule({
  imports: [PunchoutComponentsModule, PunchoutCoreModule, PunchoutOccModule],
})
export class PunchoutModule {}
