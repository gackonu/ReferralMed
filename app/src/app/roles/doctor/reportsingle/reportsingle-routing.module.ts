import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportsinglePage } from './reportsingle.page';

const routes: Routes = [
  {
    path: '',
    component: ReportsinglePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsinglePageRoutingModule {}
