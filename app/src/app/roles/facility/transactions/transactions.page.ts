import { Component, OnInit } from '@angular/core';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {

  ready = false;
  transactionslog: any;
  amountdue: number;


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
    this.calls.getrequest('/transactions').subscribe(info => {
      if(Object(info).status === 200){
        this.amountdue = Object(info).amountdue;
        this.transactionslog = Object(info).transactions;
        this.ready = true;
      }
    });
  }
}
