import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranscationsPageRoutingModule } from './transcations-routing.module';

import { TranscationsPage } from './transcations.page';
import { DoctortransactionstatePipe } from 'src/app/pipes/doctortransactionstate.pipe';
import { ReferralstatusiconPipe } from 'src/app/pipes/referralstatusicon.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranscationsPageRoutingModule
  ],
  declarations: [TranscationsPage, DoctortransactionstatePipe, ReferralstatusiconPipe]
})
export class TranscationsPageModule {}
