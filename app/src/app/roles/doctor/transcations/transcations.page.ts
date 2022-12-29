import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-transcations',
  templateUrl: './transcations.page.html',
  styleUrls: ['./transcations.page.scss'],
})
export class TranscationsPage implements OnInit {

  ready = false;
  transactions: any;
  connected = true;

  constructor(
    private calls: CallsService,
  ) { }

  ngOnInit() {
    this.fetchdata();
  }


  ionViewWillEnter(){
    this.fetchdata();
  }

  fetchdata(){
    this.calls.getrequest('/mytransactions').subscribe(info => {
      if(Object(info).status === 200){
        if(Object(info).transactions.length){
          this.transactions = Object(info).transactions;
        }
        this.ready = true;
      }
    },
    err => {
      this.connected = false;
    });
  }

}
