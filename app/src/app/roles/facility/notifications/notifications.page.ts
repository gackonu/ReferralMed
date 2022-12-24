import { Component, OnInit } from '@angular/core';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  ready = false;
  notifications: any;

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
    this.calls.getrequest('/notifications').subscribe(info => {
      if(Object(info).status === 200){
        this.notifications = Object(info).notifications;
        this.ready = true;
      }
    });
  }

}
