import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportsinglePageRoutingModule } from './reportsingle-routing.module';

import { ReportsinglePage } from './reportsingle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportsinglePageRoutingModule
  ],
  declarations: [ReportsinglePage]
})
export class ReportsinglePageModule {}
