import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewreferrallogisticsPage } from './newreferrallogistics.page';

const routes: Routes = [
  {
    path: '',
    component: NewreferrallogisticsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewreferrallogisticsPageRoutingModule {}
