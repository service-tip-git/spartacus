import { NgModule } from '@angular/core';
import { PunchoutComponentsModule } from '@spartacus/punchout/components';
import { PunchoutCoreModule } from '@spartacus/punchout/core';
import { PunchoutOccModule } from '@spartacus/punchout/occ';

@NgModule({
  imports: [PunchoutComponentsModule, PunchoutCoreModule, PunchoutOccModule],
})
export class PunchoutModule {}
