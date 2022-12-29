import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-reportsingle',
  templateUrl: './reportsingle.page.html',
  styleUrls: ['./reportsingle.page.scss'],
})
export class ReportsinglePage implements OnInit {
  baseurl: string;
  ready = false;
  reportdetails: any;
  reportid: number;
  connected = true;
  constructor(
    private calls: CallsService,
    private activatedroute: ActivatedRoute,
  ) {
    this.baseurl = this.calls.getbaseurl();
    this.reportid = this.activatedroute.snapshot.params.id;
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.fetchdata();
  }

  fetchdata(){
    this.calls.getrequest('/reportdetails/'+this.reportid).subscribe(info => {
      if(Object(info).status === 200){
        this.reportdetails = Object(info).reportdetails;
        this.ready = true;
      }
    },
    err => {
      this.connected = false;

    });
  }


}
