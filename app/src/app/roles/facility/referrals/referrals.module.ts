import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReferralsPageRoutingModule } from './referrals-routing.module';

import { ReferralsPage } from './referrals.page';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReferralsPageRoutingModule
  ],
  declarations: [ReferralsPage, SearchfilterPipe]
})
export class ReferralsPageModule {}
