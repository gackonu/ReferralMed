import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TranscationsPage } from './transcations.page';

const routes: Routes = [
  {
    path: '',
    component: TranscationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TranscationsPageRoutingModule {}
