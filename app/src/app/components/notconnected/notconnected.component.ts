import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notconnected',
  templateUrl: './notconnected.component.html',
  styleUrls: ['./notconnected.component.scss'],
})
export class NotconnectedComponent implements OnInit {
  page: string;

  constructor(
    private activatedroute: ActivatedRoute
  ) {
    this.page = this.activatedroute.snapshot.params.page;
  }

  ngOnInit() {}

}
