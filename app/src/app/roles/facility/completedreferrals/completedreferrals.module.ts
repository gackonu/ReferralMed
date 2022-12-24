import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompletedreferralsPageRoutingModule } from './completedreferrals-routing.module';

import { CompletedreferralsPage } from './completedreferrals.page';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompletedreferralsPageRoutingModule
  ],
  declarations: [CompletedreferralsPage, SearchfilterPipe]
})
export class CompletedreferralsPageModule {}
