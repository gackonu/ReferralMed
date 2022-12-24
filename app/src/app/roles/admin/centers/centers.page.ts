import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, AlertInput, LoadingController, ToastController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-centers',
  templateUrl: './centers.page.html',
  styleUrls: ['./centers.page.scss'],
})
export class CentersPage implements OnInit {

  // Page Info
  count:    any;
  centers:  any;

  newcenter: FormGroup;
  ready   = false;
  add     = false;
  constructor(
    private calls: CallsService,
    private fb: FormBuilder,
    private loading: LoadingController,
    private toast: ToastController,
    private alert: AlertController
  ) { }

  ngOnInit() {
    this.newcenter = this.fb.group({
      name: [null, [Validators.required]],
      location: [null, [Validators.required]],
      priceperreferral: [null, [Validators.required]],
      adminemail: [null, [Validators.required, Validators.email]],
      contact: [null, [Validators.required]],
      type: [null, [Validators.required]]
    });
    this.fetchdata();
  }

  ionViewWillEnter(){
    this.fetchdata();
  }

  fetchdata(){
    this.calls.getrequest('/facility').subscribe((info: any) => {
      this.count = Object(info).count;
      if(Object(info).center.length){
        this.centers = Object(info).center;
      } else {
        this.centers = null;
      }


      this.ready = true;
    });
  }

  toggleadd(){
    this.add = !this.add;
  }

  async addcenter(){
    const loading = await this.loading.create({
      message: 'Please wait',
      cssClass: 'loading',
      spinner: 'lines'
    });
    loading.present();

    this.calls.postrequest('/addcenter', this.newcenter.value).subscribe(async info => {
      loading.dismiss();
      if(Object(info).status === 403){
        const toast = await this.toast.create({
          message: 'Admin email already in use',
          header: 'Error!!',
          color: 'danger',
          icon: 'alert',
          duration: 3500,
          buttons: [{
            icon: 'close',
            role: 'cancel'
          }]
        });
        toast.present();
      }
      if(Object(info).status === 200){
        const toast = await this.toast.create({
          message: 'Facility added successfully',
          header: 'Facility Added',
          color: 'success',
          icon: 'checkmark',
          cssClass: 'custom-toast',
          duration: 3500,
          buttons: [{
            icon: 'close',
            role: 'cancel'
          }]
        });
        this.fetchdata();
        this.newcenter.reset();
        this.add = false;
        toast.present();
      }
      if(Object(info).status === 302){
        const toast = await this.toast.create({
          message: 'Facility added successfully',
          header: 'Facility Added',
          color: 'danger',
          icon: 'alert',
          cssClass: 'custom-toast',
          buttons: [{
            icon: 'close',
            role: 'cancel'
          }]
        });
        toast.present();
      }
    });
    // console.log(this.newcenter.value);
  }


  async deletecenter(id, name) {
    const alert = await this.alert.create({
      header: 'Confirm!',
      message: 'Are you sure you want to delete '+name,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('canceled'+id);
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            console.log('Confirmed'+id);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  async initpayment(id, name, dp){
    const alert = await this.alert.create({
      header: 'Enter Amount being paid in by '+name,
      inputs: [
        {
          placeholder: 'Enter Amount',
          name: 'amount',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'cancel',
          role: 'cancel'
        },
        {
          text: 'ok',
         handler: async (input: AlertInput) => {
          if(Object(input).amount > dp){
            alert.dismiss();
            const alert2 = await this.alert.create({
              header: 'Unsuccessful',
              message: 'Payment cannot be more than amount due',
              buttons: [{text: 'ok'}]
            });
            alert2.present();
          } else {
            this.makepayment(id, Object(input).amount);
          }
         }
        }
      ]
    });
    alert.present();
  }

  makepayment(id, amount){
    this.calls.getrequest('/facilitypayment/'+id+'/'+amount).subscribe(info => {
      if(Object(info).status === 200){
        this.fetchdata();
      }
    });
  }

}
