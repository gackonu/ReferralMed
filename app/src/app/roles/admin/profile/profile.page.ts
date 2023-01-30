import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  addprocedure = false;
  addlocation = false;
  available: any;
  locations: any;
  ready = false;

  procedureform: FormGroup;
  locationform: FormGroup;

  constructor(
    private calls: CallsService,
    private fb: FormBuilder,
    private alert: AlertController,
    private toast: ToastController,
    private loading: LoadingController,
    private action: ActionSheetController
  ) { }

  ngOnInit() {
    this.procedureform = this.fb.group({
      procedure: [null, [Validators.required, Validators.minLength(2)]],
      category: [null, [Validators.required, Validators.minLength(2)]]
    });
    this.locationform = this.fb.group({
      location: [null, [Validators.required, Validators.minLength(2)]],
    });
    this.fetchlist();
    this.getlocations();
  }


  ionViewWillEnter(){
    this.fetchlist();
  }


  toggleadd(){
    this.addprocedure = !this.addprocedure;
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

  getlocations(){
    this.calls.getrequest('/getlocations').subscribe(info => {
      if(Object(info).locations.length){
        this.locations = Object(info).locations;
      }
    this.ready = true;

    });
  }

  async add(){
    const action = await this.action.create({
      header: 'Item to add',
      buttons: [
        {
          text: 'Procedure',
          handler: ()  =>{
            this.addprocedure = true;
          },
        },
        {
          text: 'Location',
          handler: () => {
            this.addlocation = true;
          }
        }
      ]
    });

    await action.present();

  }

  async addnewprocedure(){
    const loading = await this.loading.create({
      message: 'Please wait',
      cssClass: 'loading',
      spinner: 'lines'
    });

    loading.present();



    this.calls.postrequest('/addprocedure', this.procedureform.value).subscribe(async info => {
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
        this.procedureform.reset();
      }

    });
  }

  async addnewlocation(){
    const loading = await this.loading.create({
      message: 'Please wait',
      cssClass: 'loading',
      spinner: 'lines'
    });

    loading.present();

    this.calls.postrequest('/addlocation', this.locationform.value).subscribe(async info => {
      loading.dismiss();
      if(Object(info).status === 304){
        const alert = await this.alert.create({
          message: 'Location already present',
          header: 'Error'
        });
        alert.present();
      }

      if(Object(info).status === 200){
        const toast = await this.toast.create({
          message: 'Location Added',
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
        this.getlocations();
        this.addlocation = false;
        this.locationform.reset();
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

  async deletelocation(id, name){
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
            this.confirmlocationdelete(id);
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


  confirmlocationdelete(id){
    // this.calls.getrequest('/deletelocation/'+id).subscribe(async info => {
    //   if(Object(info).status === 200){
    //     const toast = await this.toast.create({
    //       message: 'Procedure Deleted',
    //       header: 'Success!!',
    //       color: 'success',
    //       icon: 'check',
    //       duration: 3500,
    //       buttons: [{
    //         icon: 'close',
    //         role: 'cancel'
    //       }]
    //     });
    //     toast.present();
    //     this.fetchlist();
    //   }
    // });
  }

}
