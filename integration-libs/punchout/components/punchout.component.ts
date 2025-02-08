import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PUNCHOUT_SESSION_KEY } from '@spartacus/punchout/root';
import { PunchoutComponentService } from './punchout.component.service';

@Component({
  selector: 'cx-punchout',
  template: ` <p>punchout works!</p> `,
  standalone: false,
})
export class PunchoutComponent implements OnInit {
  protected activatedRoute = inject(ActivatedRoute);
  protected punchoutService = inject(PunchoutComponentService);

  ngOnInit(): void {
    console.log('PunchoutComponent');
    this.activatedRoute.queryParams.subscribe((param: Params) => {
      param;
      const sid = param?.[PUNCHOUT_SESSION_KEY];
      if (sid) {
        this.punchoutService.setSessionId(sid);
        this.punchoutService.getPunchoutSession(sid).subscribe((session) => {
          console.log('session: ', session);
        });
      }
      // this.punchoutService
      //   .logout()
      //   .pipe(delay(5000))
      //   .subscribe((res) => {
      //     console.log('logout res: ', res);

      //   });
      console.log('sid is ', sid);
    });
  }
}
