import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompletedreferralsPageRoutingModule } from './completedreferrals-routing.module';

import { CompletedreferralsPage } from './completedreferrals.page';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';
import { MainModule } from 'src/app/shared/main/main.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompletedreferralsPageRoutingModule,
    MainModule
  ],
  declarations: [CompletedreferralsPage, SearchfilterPipe]
})
export class CompletedreferralsPageModule {}
