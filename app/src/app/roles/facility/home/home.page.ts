import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  ready = false;
  baseurl: string;

  amountdue: string;
  stats: any;
  incoming: any;
  userdetails: any;
  connected = true;
  constructor(
    private calls: CallsService,
    private alert: AlertController,
    private loading: LoadingController,
    private router: Router
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
    this.calls.getrequest('/homepage').subscribe(info => {
      if(Object(info).status === 200){
        this.amountdue = Object(info).data.payment;
        this.userdetails = Object(info).data.userdetails;
        this.stats = Object(info).data.stats;
        if(Object(info).data.incoming.length){
          this.incoming = Object(info).data.incoming;
        } else {
          this.incoming = null;
        }
        this.ready = true;
      }
    },
    err => {
      this.connected = false;
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
        this.router.navigateByUrl('/facility/completedreferrals');
      }
    });
  }

}
