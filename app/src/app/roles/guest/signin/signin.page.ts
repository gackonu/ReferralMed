import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { CallsService } from 'src/app/services/calls.service';
import { StorageService } from 'src/app/services/storage.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  credentials!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private storage: StorageService,
    private token: TokenService,
    private calls: CallsService,
    private loading: LoadingController,
    private alert: AlertController,
    private app: AppComponent
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
  }

  ionViewDidEnter(){
    this.app.getwho();
  }

  async login(){
    const loading = await this.loading.create({
      message: 'Please wait',
      cssClass: 'loading',
      spinner: 'lines'
    });
    loading.present();


    this.calls.postrequest('signin', this.credentials.value).subscribe(async info => {
        loading.dismiss();
      if(Object(info).status === 'error'){
        const alert = await this.alert.create({
          header: 'Signin Unsuccessful',
          message: Object(info).message,
          buttons: ['Ok']
        });
        alert.present();
      }
      if(Object(info).status === 'success'){
        this.storage.storeItem('token', Object(info).token);
        this.storage.storeItem('role', this.token.decodenewtoken(Object(info).token).aud);
        this.app.getwho();
        this.calls.rolecheck();
        this.credentials.reset();
        this.router.navigate([`/`, this.token.decodenewtoken(Object(info).token).aud], {replaceUrl: true});
        // this.router.navigateByUrl('/'+this.token.decodenewtoken(Object(info).token).aud);
      }

    },
    async err => {
      loading.dismiss();
      const alert = await this.alert.create({
        header: 'Error',
        message: 'No Internet Connection, please try again later',
        buttons: ['Ok']
      });
      alert.present();
    }
    );



  }

}
