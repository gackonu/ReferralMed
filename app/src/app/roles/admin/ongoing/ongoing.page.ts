import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
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

  async markascompleted(id, name){
    const alert = await this.alert.create({
      header: 'Confirm Completion',
      message: 'Proceed to prepare report for '+name,
      buttons: [
        {
          text: 'cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler:() => {
            this.procedurecomplete(id);
          }
        }
      ]
    });
    alert.present();
  }

  async procedurecomplete(id){
    const loading = await this.loading.create({
      message: 'Please Wait',
      spinner: 'lines',
      cssClass: 'loading'
    });
    loading.present();
    this.calls.getrequest('/procedurecomplete/'+id).subscribe(info => {

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
