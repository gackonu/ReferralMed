import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { VerifyaccountComponent } from './verifyaccount/verifyaccount.component';

const routes: Routes = [
    { path: 'resetpassword/:token', component: ResetpasswordComponent },
    { path: 'verifyaccount/:token', component: VerifyaccountComponent },
    { path: '', component: HomepageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
