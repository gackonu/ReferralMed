import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpgradeimagePage } from './upgradeimage.page';

const routes: Routes = [
  {
    path: '',
    component: UpgradeimagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpgradeimagePageRoutingModule {}
