import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { MainModule } from 'src/app/shared/main/main.module';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    ReactiveFormsModule,
    MainModule
  ],
  declarations: [ProfilePage, SearchfilterPipe]
})
export class ProfilePageModule {}
