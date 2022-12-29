import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryPageRoutingModule } from './history-routing.module';

import { HistoryPage } from './history.page';
import { ReferralstatusiconPipe } from 'src/app/pipes/referralstatusicon.pipe';
import { MainModule } from 'src/app/shared/main/main.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryPageRoutingModule,
    MainModule
  ],
  declarations: [HistoryPage]
})
export class HistoryPageModule {}
