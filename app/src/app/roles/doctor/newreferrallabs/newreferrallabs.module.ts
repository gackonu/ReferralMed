import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewreferrallabsPageRoutingModule } from './newreferrallabs-routing.module';

import { NewreferrallabsPage } from './newreferrallabs.page';
import { MainModule } from 'src/app/shared/main/main.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewreferrallabsPageRoutingModule,
    ReactiveFormsModule,
    MainModule
  ],
  declarations: [NewreferrallabsPage]
})
export class NewreferrallabsPageModule {}
