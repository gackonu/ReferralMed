import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {

  resetform: FormGroup;


  constructor(
    private router: Router,
    private calls: CallsService,
    private fb: FormBuilder,
    private alert: AlertController,
    private toast: ToastController
  ) {}

  ngOnInit() {
    this.resetform = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  ionViewWillEnter(){
    this.resetform = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  submitreset(){
    this.calls.postrequest('requestpasswordreset', this.resetform.value).subscribe(async info => {
      if(Object(info).status === 201){
        const alert = await this.alert.create({
          header: 'Error',
          message: 'Email not found. Please try again later',
          buttons: [{
            text: 'Ok',
            role: 'cancel'
          }]
        });
        alert.present();
      }

      if(Object(info).status === 200){
        const toast = await this.toast.create({
          header: 'Success',
          message: 'Hello '+Object(info).name+', a password reset token has been sent to your email. Please follow through',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.router.navigateByUrl('/guest');
      }

    });
  }


}
