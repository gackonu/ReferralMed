import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotconnectedComponent } from 'src/app/components/notconnected/notconnected.component';
import { DoctorComponent } from './doctor.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.module').then( m => m.HistoryPageModule)
  },
  {
    path: 'transcations',
    loadChildren: () => import('./transcations/transcations.module').then( m => m.TranscationsPageModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then( m => m.ReportsPageModule)
  },
  {
    path: 'reportsingle/:id',
    loadChildren: () => import('./reportsingle/reportsingle.module').then( m => m.ReportsinglePageModule)
  },
  {
    path: 'newreferral/:type',
    loadChildren: () => import('./newreferal/newreferal.module').then( m => m.NewreferalPageModule)
  },
  {
    path: 'newreferralscans',
    loadChildren: () => import('./newreferralscans/newreferralscans.module').then( m => m.NewreferralscansPageModule)
  },
  {
    path: 'noconnection/:page',
    component: NotconnectedComponent
  },
  { path: '', pathMatch: 'full', redirectTo: 'home'},
  { path: '**', pathMatch: 'full', redirectTo: 'home'},
  {
    path: 'newreferal',
    loadChildren: () => import('./newreferal/newreferal.module').then( m => m.NewreferalPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }
