import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportsinglePageRoutingModule } from './reportsingle-routing.module';

import { ReportsinglePage } from './reportsingle.page';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportsinglePageRoutingModule,
    CKEditorModule,
    ReactiveFormsModule
  ],
  declarations: [ReportsinglePage]
})
export class ReportsinglePageModule {}
