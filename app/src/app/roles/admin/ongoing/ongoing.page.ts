import { Component, OnInit } from '@angular/core';
import { AlertController, AlertInput, LoadingController, ToastController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.page.html',
  styleUrls: ['./ongoing.page.scss'],
})
export class OngoingPage implements OnInit {

  ongoingreferrals: object[] = [];
  data: string;

  // results = [...this.ongoingreferrals];
  ready = false;

  constructor(
    private calls: CallsService,
    private alert: AlertController,
    private toast: ToastController,
    private loading: LoadingController
  ) { }

  ngOnInit() {
    this.fetchdata();
  }

  ionViewWillEnter(){
    this.fetchdata();
  }

  fetchdata(){
    this.calls.getrequest('/ongoingreferrals').subscribe(info => {
      if(Object(info).ongoingreferrals.length){
        this.ongoingreferrals = Object(info).ongoingreferrals;
      } else {
        this.ongoingreferrals = null;
      }
      this.ready = true;
    });
  }

  async markascompleted(id, name, procedures){
    const alert = await this.alert.create({
      header: 'Enter Amount',
      message: 'Enter Amount to be paid by '+name+' for '+procedures,
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
            this.procedurecomplete(id, Object(input).amount);
          }
        }
      ]
    });

    alert.present();
  }

  async procedurecomplete(id, amount){
    const loading = await this.loading.create({
      message: 'Please Wait',
      spinner: 'lines',
      cssClass: 'loading'
    });
    loading.present();
    this.calls.getrequest('/procedurecomplete/'+id+'/'+amount).subscribe(info => {

      if(Object(info).status === 200){
        loading.dismiss();
        this.fetchdata();
      }
    });
  }

  async cancelreferral(id, name){
    const alert = await this.alert.create({
      header: 'Cancel Referral',
      message: 'Confirm referral cancellation of '+name,
      buttons: [
        {
          text: 'canel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: () => {
            this.cancel(id);
          }
        }
      ]
    });

    alert.present();
  }

  cancel(id){
    this.calls.getrequest('/cancelreferral/'+id).subscribe(info => {
      if(Object(info).status === 200){
        this.fetchdata();
      }
    });
  }

}
