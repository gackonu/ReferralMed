import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { CallsService } from './services/calls.service';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  doctor!: boolean;
  admin!: boolean;
  facility!: boolean;

  constructor(
    private menu: MenuController,
    private storage: StorageService,
    private router: Router,
    private calls: CallsService
  ) {}

  ngOnInit(): void {
    this.getwho();
  }

  async getwho(){
    const role = this.storage.getItem('role');

      if(role === 'doctor'){
        this.doctor = true;
        this.admin = false;
        this.facility = false;
      }
      if(role === 'admin'){
        this.doctor = false;
        this.admin = true;
        this.facility = false;
      }
      if(role === 'facility'){
        this.doctor = false;
        this.admin = false;
        this.facility = true;
      }

      if(!role){
        this.doctor = false;
        this.admin = false;
        this.facility = false;
      }

    };


  closemenu(){
    this.menu.close();
  }

  logout(){
    this.storage.removeItem('role');
    this.storage.removeItem('token');
    this.calls.rolecheck();
    // this.getwho();
    this.router.navigateByUrl('/guest');
  }

}
