import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { CallsService } from 'src/app/services/calls.service';
import { StorageService } from 'src/app/services/storage.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private router: Router,
    private calls: CallsService,
    private fb: FormBuilder,
    private loading: LoadingController,
    private toast: ToastController,
    private token: TokenService,
    private storage: StorageService,
    private app: AppComponent
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      fullname: [null, [Validators.required, Validators.minLength(6)]],
      email: [null, [Validators.required, Validators.email]],
      phonenumber: [null, [Validators.required, Validators.minLength(10)]],
      healthworker: [null],
      password: [null, [Validators.required, Validators.minLength(6)]],
      cpassword: [null, [Validators.required]]
    });
  }

  async signup(){
    const loading = await this.loading.create({
      message: 'Please wait',
      cssClass: 'loading',
      spinner: 'lines'
    });
    await loading.present();

    this.calls.postrequest('signup', this.credentials.value).subscribe(info => {

      if(Object(info).status === 'validationerror'){
        loading.dismiss();
        Object(info).errors.forEach(async element => {
          if(element.length){
            const toast = this.toast.create({
              message: element,
              header: 'Sign up Error',
              color: 'danger',
              icon: 'alert',
              cssClass: 'custom-toast',
              buttons: [{
                icon: 'close',
                role: 'cancel'
              }]
            });
            (await toast).present();
          }
        });
      }

      if(Object(info).status === 200){
        this.storage.storeItem('token', Object(info).token);
        this.storage.storeItem('role', this.token.decodenewtoken(Object(info).token).aud);
        this.app.getwho();
        this.calls.rolecheck();
        this.credentials.reset();
        loading.dismiss();
        this.router.navigateByUrl('/');
      }

    });
  }

}
