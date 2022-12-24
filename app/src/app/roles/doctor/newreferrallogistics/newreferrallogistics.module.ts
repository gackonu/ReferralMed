import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewreferrallogisticsPageRoutingModule } from './newreferrallogistics-routing.module';

import { NewreferrallogisticsPage } from './newreferrallogistics.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewreferrallogisticsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NewreferrallogisticsPage]
})
export class NewreferrallogisticsPageModule {}
