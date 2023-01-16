import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NotconnectedComponent } from './components/notconnected/notconnected.component';
import { AdminGuard } from './guards/admin.guard';
import { DoctorGuard } from './guards/doctor.guard';
import { FacilityGuard } from './guards/facility.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'guest',
    loadChildren: () => import('./roles/guest/guest.module').then(m => m.GuestModule)
  },
  {
    path: 'doctor',
    loadChildren: () => import('./roles/doctor/doctor.module').then(m => m.DoctorModule),
    canLoad: [DoctorGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./roles/admin/admin.module').then(m => m.AdminModule),
    canLoad: [AdminGuard]
  },
  {
    path: 'facility',
    loadChildren: () => import('./roles/facility/facility.module').then(m => m.FacilityModule),
    canLoad: [FacilityGuard]
  },
  { path: '', pathMatch: 'full', redirectTo: 'guest' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
