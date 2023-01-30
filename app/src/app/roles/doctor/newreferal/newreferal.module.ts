import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewreferalPageRoutingModule } from './newreferal-routing.module';

import { NewreferalPage } from './newreferal.page';
import { MainModule } from "../../../shared/main/main.module";

@NgModule({
    declarations: [NewreferalPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NewreferalPageRoutingModule,
        ReactiveFormsModule,
        MainModule
    ]
})
export class NewreferalPageModule {}
