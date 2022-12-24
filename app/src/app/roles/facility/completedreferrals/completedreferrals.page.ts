import { Component, OnInit } from '@angular/core';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-completedreferrals',
  templateUrl: './completedreferrals.page.html',
  styleUrls: ['./completedreferrals.page.scss'],
})
export class CompletedreferralsPage implements OnInit {
  ready = false;
  pendingreports: any;
  data: string;

  constructor(
    private calls: CallsService
  ) { }

  ngOnInit() {
    this.fetchdata();
  }

  ionViewWillEnter(){
    this.fetchdata();
  }

  fetchdata(){
    this.calls.getrequest('/pendingreports').subscribe(info => {
      if(Object(info).status === 200){
        if(Object(info).pendingreports.length){
          this.pendingreports = Object(info).pendingreports;
        } else {
          this.pendingreports = null;
        }
        this.ready = true;
      }
    });
  }

}
