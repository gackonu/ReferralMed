import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReferralsPageRoutingModule } from './referrals-routing.module';

import { ReferralsPage } from './referrals.page';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';
import { MainModule } from 'src/app/shared/main/main.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReferralsPageRoutingModule,
    MainModule
  ],
  declarations: [ReferralsPage, SearchfilterPipe]
})
export class ReferralsPageModule {}
