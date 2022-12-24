import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompletedreferralsPage } from './completedreferrals.page';

const routes: Routes = [
  {
    path: '',
    component: CompletedreferralsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompletedreferralsPageRoutingModule {}
