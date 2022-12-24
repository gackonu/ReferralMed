import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewreferrallabsPageRoutingModule } from './newreferrallabs-routing.module';

import { NewreferrallabsPage } from './newreferrallabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewreferrallabsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NewreferrallabsPage]
})
export class NewreferrallabsPageModule {}
