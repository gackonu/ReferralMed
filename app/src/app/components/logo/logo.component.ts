import { Component } from '@angular/core';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent {
  baseurl: string;
  constructor(
    private calls: CallsService
  ) {
    this.baseurl = this.calls.getbaseurl();
   }


}
