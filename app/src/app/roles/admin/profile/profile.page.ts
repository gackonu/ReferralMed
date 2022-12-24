import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  add = false;
  available: any;

  newitem: FormGroup;

  constructor(
    private calls: CallsService,
    private fb: FormBuilder,
    private alert: AlertController,
    private toast: ToastController,
    private loading: LoadingController
  ) { }

  ngOnInit() {
    this.newitem = this.fb.group({
      procedure: [null, [Validators.required, Validators.minLength(2)]],
      category: [null, [Validators.required, Validators.minLength(2)]]
    });
  }


  ionViewWillEnter(){
    this.fetchlist();
  }


  toggleadd(){
    this.add = !this.add;
  }

  fetchlist(){
    this.calls.getrequest('/allprocedures').subscribe(info => {
      if(Object(info).status === 200){
        this.available = Object(info).procedures;
      }
      if(Object(info).status === 204){
        this.available = null;
      }
    });
  }

  async additem(){
    const loading = await this.loading.create({
      message: 'Please wait',
      cssClass: 'loading',
      spinner: 'lines'
    });

    loading.present();



    this.calls.postrequest('/addprocedure', this.newitem.value).subscribe(async info => {
      loading.dismiss();
      if(Object(info).status === 304){
        const alert = await this.alert.create({
          message: 'Procedure already present',
          header: 'Error'
        });

        alert.present();

      }

      if(Object(info).status === 200){
        const toast = await this.toast.create({
          message: 'Procedure Added',
          header: 'Success!!',
          color: 'success',
          icon: 'check',
          duration: 3500,
          buttons: [{
            icon: 'close',
            role: 'cancel'
          }]
        });
        toast.present();
        this.fetchlist();
        this.newitem.reset();
      }

    });
  }

  async deleteprocedure(id, name){
    const alert = await this.alert.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete '+name,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          role: 'confirm',
          handler: () => {
            this.confirmdelete(id);
          }
        }
      ],
    });

    alert.present();

  }

  confirmdelete(id){
    this.calls.getrequest('/deleteprocedure/'+id).subscribe(async info => {
      if(Object(info).status === 200){
        const toast = await this.toast.create({
          message: 'Procedure Deleted',
          header: 'Success!!',
          color: 'success',
          icon: 'check',
          duration: 3500,
          buttons: [{
            icon: 'close',
            role: 'cancel'
          }]
        });
        toast.present();
        this.fetchlist();
      }
    });
  }

}
