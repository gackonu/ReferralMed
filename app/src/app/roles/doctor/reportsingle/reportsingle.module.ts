import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportsinglePageRoutingModule } from './reportsingle-routing.module';

import { ReportsinglePage } from './reportsingle.page';
import { MainModule } from 'src/app/shared/main/main.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportsinglePageRoutingModule,
    MainModule
  ],
  declarations: [ReportsinglePage]
})
export class ReportsinglePageModule {}
