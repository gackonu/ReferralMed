import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranscationsPageRoutingModule } from './transcations-routing.module';

import { TranscationsPage } from './transcations.page';
import { DoctortransactionstatePipe } from 'src/app/pipes/doctortransactionstate.pipe';
import { ReferralstatusiconPipe } from 'src/app/pipes/referralstatusicon.pipe';
import { MainModule } from 'src/app/shared/main/main.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranscationsPageRoutingModule,
    MainModule
  ],
  declarations: [TranscationsPage, DoctortransactionstatePipe]
})
export class TranscationsPageModule {}
