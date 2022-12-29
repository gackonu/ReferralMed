import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.page.html',
  styleUrls: ['./referrals.page.scss'],
})
export class ReferralsPage implements OnInit {
  ready = false;
  incoming: any;
  data: string;
  connected = true;


  constructor(
    private calls: CallsService,
    private alert: AlertController,
    private loading: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.fetchdata();
  }

  ionViewWillEnter(){
    this.fetchdata();
  }

  fetchdata(){
    this.calls.getrequest('/allincoming').subscribe(info => {
      if(Object(info).status === 200){
        if(Object(info).incoming.length){
          this.incoming = Object(info).incoming;
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
