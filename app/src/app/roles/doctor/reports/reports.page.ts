import { Component, OnInit } from '@angular/core';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  ready = false;
  readyreports: any;
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
    this.calls.getrequest('/getreports').subscribe(info => {
      if(Object(info).reports.length){
        this.readyreports = Object(info).reports;
      }
      this.ready = true;
    });
  }

}
