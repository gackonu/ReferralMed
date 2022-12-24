import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { VerifyaccountComponent } from './verifyaccount/verifyaccount.component';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ResetpasswordComponent,
    VerifyaccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
