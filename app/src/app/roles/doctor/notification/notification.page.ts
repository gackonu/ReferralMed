import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  ready = false;
  notifications: any;
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
    this.calls.getrequest('/notifications').subscribe(info => {
      if(Object(info).status === 200){
        this.notifications = Object(info).notifications;
        this.ready = true;
      }
    },
    err => {
      this.connected = false;
    });
  }

}
