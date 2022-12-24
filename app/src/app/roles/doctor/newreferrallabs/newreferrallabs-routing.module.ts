import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewreferrallabsPage } from './newreferrallabs.page';

const routes: Routes = [
  {
    path: '',
    component: NewreferrallabsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewreferrallabsPageRoutingModule {}
