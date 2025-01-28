import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cx-punchout',
  template: ` <p>punchout works!</p> `,
  standalone: false,
})
export class PunchoutComponent implements OnInit {
  ngOnInit(): void {
    console.log('PunchoutComponent');
  }
}
