import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-newreferralscans',
  templateUrl: './newreferralscans.page.html',
  styleUrls: ['./newreferralscans.page.scss'],
})
export class NewreferralscansPage implements OnInit {
  referralform: FormGroup;
  availableprocedures: any;
  ready= false;
  hospital: any;
  connected = true;
  constructor(
    private calls: CallsService,
    private loading: LoadingController,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastController,
    private alert: AlertController
  ) { }

  ngOnInit() {
    this.fetchprocedures();
  }

  prepareform(){
    this.referralform = this.fb.group({
      patientname: [null, [Validators.required, Validators.minLength(2)]],
      patientage: [null, [Validators.required]],
      patientcontact: [null, [Validators.required, Validators.minLength(10)]],
      procedure: [null, [Validators.required]],
      additionalnotes: [null, []],
      hospital: [null, [Validators.required, Validators.minLength(2)]],
      gender: [null, [Validators.required]],
      proceduretype: ['scan'],
      mode: ['full']
    });
    this.ready = true;
  }

  fetchprocedures(){
    this.calls.getrequest('/fetchprocedures/scan').subscribe(async info => {
      this.availableprocedures = Object(info).procedures;
      if(Object(info).hospital.length){
        this.hospital = Object(info).hospital;
      } else {
        const alert = await this.alert.create({
          header: 'No Hospital Selected',
          message: 'It is highly recommended need to choose hosptial(s) you are making referrals from',
          buttons: [
            {
              text: 'Compelete Setup',
              handler: () => {
                this.router.navigateByUrl('/doctor/profile');
              }
            },
            {
              text: 'Complete Later',
              role: 'Ok',
            }
          ]
        });
        alert.present();
      }
      this.prepareform();
    },
    err => {
      this.connected = false;
    });
  }

  async sendrequest(){
    const loading = await this.loading.create({
      message: 'Please wait',
      cssClass: 'loading',
      spinner: 'lines'
    });
    loading.present();

    this.calls.postrequest('/makereferral', this.referralform.value).subscribe(async info => {
      loading.dismiss();
      if(Object(info).status === 200){
        const toast =  await this.toast.create({
            message: 'Referral Recieved. Thank you',
            header: 'Success',
            color: 'success',
            // icon: 'check',
            duration: 3500,
            buttons: [{
              icon: 'close',
              role: 'cancel'
            }]
          });
          toast.present();
          this.router.navigateByUrl('doctor/');
      }
    });

  }

}
