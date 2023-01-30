import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';
import { PhotoService } from 'src/app/services/photo.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  isModalOpen = false;


  baseurl: string;
  ready = false;
  info: any;
  hospitals: any;
  profileform: FormGroup;
  connected = true;
  searchval: string;
  selectedhospitals: string[] = [];
  selectedhospitalstring = '';



  constructor(
    private calls: CallsService,
    private fb: FormBuilder,
    private loading: LoadingController,
    private toast: ToastController,
    public photo: PhotoService,
  ) {
    this.baseurl = this.calls.getbaseurl();
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.fetchdata();
  }

  fetchdata(){
    this.calls.getrequest('/profile').subscribe(info => {
      this.info = Object(info).info;
      this.hospitals = Object(info).hospitals;
      if(Object(info).info.hospital){
        this.selectedhospitals = Object(info).info.hospital.split(',');
      }
      this.ready = true;
      this.prepareform();
    },
    err => {
      this.connected = false;
    });
  }

  prepareform(){
    this.profileform = this.fb.group({
      name: [this.info.first_name+' '+this.info.last_name, [Validators.required, Validators.minLength(2)]],
      phonenumber: [this.info.phone_number, [Validators.required, Validators.minLength(10)]],
      hospital: [this.info.hospital, [Validators.required]],
    });
  }

  onWillDismiss(event: Event) {
    this.selectedhospitalstring = this.selectedhospitals.toString();
    this.isModalOpen = false;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  added(hospitalname){
    if(!this.selectedhospitals.includes(hospitalname)){
      this.selectedhospitals.push(hospitalname);
    } else {
      const index = this.selectedhospitals.indexOf(hospitalname);
      if(index !== -1){
        this.selectedhospitals.splice(index, 1);
      }
    }
  }

  isalreadychecked(hospitalname){
    if(this.selectedhospitals.includes(hospitalname)){
      return true;
    } else {
      return false;
    }
  }

  async updateprofile(){
    const loading = await this.loading.create({
        message: 'Updating',
        spinner: 'lines'
    });

    loading.present();
    this.profileform.patchValue({hospital: this.selectedhospitals});

    this.calls.postrequest('/updateprofile', this.profileform.value).subscribe(async info => {
      loading.dismiss();

      if(Object(info).status === 200){
        const toast = await this.toast.create({
          header: 'Successful',
          message: 'Profile updated successfully',
          duration: 3500,
          color: 'success',
          icon: 'checkmark',
          buttons: [
            {
              icon: 'close',
              role: 'close'
            }
          ]
        });
        toast.present();
        this.fetchdata();
      }

    });

  }


}
