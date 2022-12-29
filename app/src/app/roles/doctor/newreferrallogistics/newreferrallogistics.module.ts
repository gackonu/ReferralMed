import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewreferrallogisticsPageRoutingModule } from './newreferrallogistics-routing.module';

import { NewreferrallogisticsPage } from './newreferrallogistics.page';
import { MainModule } from 'src/app/shared/main/main.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewreferrallogisticsPageRoutingModule,
    ReactiveFormsModule,
    MainModule
  ],
  declarations: [NewreferrallogisticsPage]
})
export class NewreferrallogisticsPageModule {}
