import { Component, OnInit } from '@angular/core';
import { AlertController, AlertInput, ToastController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.page.html',
  styleUrls: ['./doctors.page.scss'],
})
export class DoctorsPage implements OnInit {
  baseurl: string;
  doctors: any;
  ready = false;

  constructor(
    private calls: CallsService,
    private alert: AlertController,
    private toast: ToastController
  ) {
    this.baseurl = this.calls.getbaseurl();
  }

  ngOnInit() {
    this.fetchdata();
  }

  ionViewWillEnter(){
    this.fetchdata();
  }

  fetchdata(){
    this.calls.getrequest('/fetchdoctors').subscribe(info => {
      if(Object(info).status === 200){
        if(Object(info).doctors.length){
          this.doctors = Object(info).doctors;
        }
        this.ready = true;
      }
    });
  }

  async resetbalance(id, name, cb){
    if(cb < 5){
      const alert2 = await this.alert.create({
        header: 'Not Allowed',
        message: 'Action not permitted for accounts with less than 5 cedis',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel'
          }
        ]
      });
      alert2.present();
      return;
    }
    const alert = await this.alert.create({
      header: 'Enter Amount',
      message: 'Enter Amount being refunded to '+name,
      inputs: [
        {
          placeholder: 'Amount',
          type: 'number',
          name: 'amount'
        }
      ],
      buttons: [
        {
          text: 'cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: (input: AlertInput) => {
            this.reset(id, Object(input).amount);
          }
        }
      ]
    });

    alert.present();

  }

  reset(id, amount){
    this.calls.getrequest('/restbalance/'+id+'/'+amount).subscribe(info => {
      if(Object(info).status === 200){
        this.fetchdata();
      }
    });
  }

}
