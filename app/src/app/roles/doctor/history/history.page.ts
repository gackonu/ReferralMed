import { Component, OnInit } from '@angular/core';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  history: any;

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
    this.calls.getrequest('/history').subscribe(info => {
      if(Object(info).history.length){
        this.history = Object(info).history;
      }
    });
  }

}
