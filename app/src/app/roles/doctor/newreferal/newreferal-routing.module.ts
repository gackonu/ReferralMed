import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewreferalPage } from './newreferal.page';

const routes: Routes = [
  {
    path: '',
    component: NewreferalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewreferalPageRoutingModule {}
