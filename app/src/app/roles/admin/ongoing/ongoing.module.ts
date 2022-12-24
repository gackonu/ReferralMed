import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OngoingPageRoutingModule } from './ongoing-routing.module';

import { OngoingPage } from './ongoing.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SearchfilterPipe } from 'src/app/pipes/searchfilter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OngoingPageRoutingModule
  ],
  declarations: [OngoingPage, SearchfilterPipe]
})
export class OngoingPageModule {}
