import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewreferralscansPage } from './newreferralscans.page';

const routes: Routes = [
  {
    path: '',
    component: NewreferralscansPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewreferralscansPageRoutingModule {}
