import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'doctors',
    loadChildren: () => import('./doctors/doctors.module').then( m => m.DoctorsPageModule)
  },
  {
    path: 'centers',
    loadChildren: () => import('./centers/centers.module').then( m => m.CentersPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions.module').then( m => m.TransactionsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'ongoing',
    loadChildren: () => import('./ongoing/ongoing.module').then( m => m.OngoingPageModule)
  },
  {
    path: 'upgradeimage/:id',
    loadChildren: () => import('./upgradeimage/upgradeimage.module').then( m => m.UpgradeimagePageModule)
  },
  {
    path: 'completed',
    loadChildren: () => import('./completed/completed.module').then( m => m.CompletedPageModule)
  },
  {
    path: 'towns/:id',
    loadChildren: () => import('./towns/towns.module').then( m => m.TownsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
