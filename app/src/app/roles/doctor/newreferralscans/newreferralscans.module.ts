import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewreferralscansPageRoutingModule } from './newreferralscans-routing.module';

import { NewreferralscansPage } from './newreferralscans.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewreferralscansPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NewreferralscansPage]
})
export class NewreferralscansPageModule {}
