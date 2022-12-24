import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpgradeimagePageRoutingModule } from './upgradeimage-routing.module';

import { UpgradeimagePage } from './upgradeimage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpgradeimagePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [UpgradeimagePage]
})
export class UpgradeimagePageModule {}
