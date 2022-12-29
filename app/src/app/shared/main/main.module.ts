import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotconnectedComponent } from 'src/app/components/notconnected/notconnected.component';
import { ReferralstatusiconPipe } from 'src/app/pipes/referralstatusicon.pipe';



@NgModule({
  declarations: [NotconnectedComponent, ReferralstatusiconPipe],
  imports: [
    CommonModule,
  ],
  exports: [NotconnectedComponent, ReferralstatusiconPipe]
})
export class MainModule { }
