import { Component, OnInit } from '@angular/core';
import { AlertController, AlertInput } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.page.html',
  styleUrls: ['./completed.page.scss'],
})
export class CompletedPage implements OnInit {

  ready = false;
  unpaidlist: any;

  constructor(
    private calls: CallsService,
    private alert: AlertController,
  ) { }

  ngOnInit() {
    this.fetchdata();
  }

  ionViewWillEnter(){
    this.fetchdata();
  }

  fetchdata(){
    this.calls.getrequest('/getupaidlist').subscribe(info => {
      if(Object(info).status === 200){
        if(Object(info).unpaidlist.length){
          this.unpaidlist = Object(info).unpaidlist;
        } else {
          this.unpaidlist = null;
        }
        this.ready = true;
      }
    });
  }

  async paydoctor(id){
    const alert = await this.alert.create({
      header: 'Confirm Payment',
      message: 'Enter Amount to Pay Doctor',
      inputs: [
        {
          type: 'number',
          name: 'amount',
          placeholder: 'Enter Amount'
        }
      ],
      buttons: [
        {
          text: 'cancel',
          role: 'cancel'
        },
        {
          text: 'ok',
          handler: (input: AlertInput) => {
            this.sendpayment(id, Object(input).amount);
          }
        }
      ]
    });

    alert.present();

  }

  sendpayment(id, amount){
    this.calls.getrequest('/paydoctor/'+id+'/'+amount).subscribe(info => {
      if(Object(info).status === 200){
        this.fetchdata();
      }
    });
  }

}
