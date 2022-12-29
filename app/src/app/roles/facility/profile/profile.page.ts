import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  baseurl: string;
  ready = false;
  info: any;
  hospitals: any;
  profileform: FormGroup;
  connected = true;

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

  async updateprofile(){
    const loading = await this.loading.create({
        message: 'Updating',
        spinner: 'lines'
    });

    loading.present();

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

  takePicture(){
    this.photo.addNewToGallery();
  }
}
