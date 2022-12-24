import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CallsService } from 'src/app/services/calls.service';
import { StorageService } from 'src/app/services/storage.service';
import { SwiperComponent } from 'swiper/angular';


@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage {
  @ViewChild('swiper', {static: false}) swiper?: SwiperComponent;

  constructor(
    private router: Router,
    private storage: StorageService,
  ) { }

  next(){
    this.swiper.swiperRef.slideNext(1000);
  }

  start(){
    localStorage.setItem('seenintro', 'true');
    this.router.navigateByUrl('guest/signin');
  }

}
