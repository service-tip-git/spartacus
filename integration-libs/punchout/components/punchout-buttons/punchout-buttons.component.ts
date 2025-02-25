import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { PunchoutComponentService } from '../punchout.component.service';

@Component({
  selector: 'cx-punchout-buttons',
  templateUrl: './punchout-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PunchoutButtonsComponent implements OnInit {
  protected punchoutService = inject(PunchoutComponentService);

  hasSessionId: boolean;

  ngOnInit(): void {
    this.hasSessionId = !!this.punchoutService.getPunchoutState().sId;
  }
  submitRequisition() {
    console.log('submitRequisition');
    this.punchoutService.navigateToRequistionPage();
  }
}
