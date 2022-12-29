import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { ReferralstatusiconPipe } from 'src/app/pipes/referralstatusicon.pipe';
import { MainModule } from 'src/app/shared/main/main.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule,
    MainModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
