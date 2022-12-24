import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ActionSheetController, AlertController, Platform, ToastController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';
import { Capacitor } from '@capacitor/core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  verified: boolean;
  userinfo: any;
  stats: any;
  referrals: any;
  quicksend = false;

  filedata: any = '';

  ready: boolean;
  baseurl: string;

  quicksendform: FormGroup;
  quicksendimage: any;


  constructor(
    public actionsheet: ActionSheetController,
    public router: Router,
    public calls: CallsService,
    public fb: FormBuilder,
    public alert: AlertController,
    public platform: Platform,
    public sanitizer: DomSanitizer,
    public toast: ToastController,
  ) {
    this.baseurl = this.calls.getbaseurl();
  }

  ngOnInit() {
    this.quicksendform = this.fb.group({
      contact: [null, [Validators.required, Validators.minLength(10)]],
      file: [null]
    });
    this.fetchhomedata();
  }

  ionViewWillEnter(){
    this.fetchhomedata();
  }

  fetchhomedata(){
    this.calls.getrequest('/homepage').subscribe(info => {
      this.userinfo = Object(info).userdetails;
      this.stats = Object(info).stats;
      if(Object(info).verified === 1){
        this.verified = true;
      }
      if(Object(info).referrals.length){
        this.referrals = Object(info).referrals;
      } else{
        this.referrals = null;
      }
      this.ready = true;
    });
  }

  async createnew() {
    const actionSheet = await this.actionsheet.create({
      header: 'Select Referral Type',
      cssClass: '',
      buttons: [{
        text: 'Labs',
        icon: '',
        data: {
          type: 'delete'
        },
        handler: () => {
          this.router.navigateByUrl('/doctor/newreferrallabs');
        }
      }, {
        text: 'Scan',
        icon: '',
        handler: () => {
          this.router.navigateByUrl('/doctor/newreferralscans');
        }
      }, {
        text: 'Logisitics',
        icon: '',
        data: 'Data value',
        handler: () => {
          this.router.navigateByUrl('/doctor/newreferrallogistics');
        }
      },
       {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
  }

  async photomode(){
    const capturedphoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const savedimagefile = await this.picturetaken(capturedphoto);

    this.quicksend = true;
    return;

  }

  async normalmode(){
    const alert = await this.alert.create({
      header: 'Ignore Entry',
      message: 'Are you sure you want to cancel this action',
      buttons: [
        {
          text: 'Yes',
          handler:() => {
            this.quicksend = false;
          }
        },
        {
          text: 'No',
          handler:() => {
            alert.dismiss();
          }
        }
      ]
    });

    alert.present();
  }

  quicksendsend(){
    this.filedata.append('contact', this.quicksendform.value.contact);
    this.calls.postrequest('/uploadpicture', this.filedata).subscribe(async info => {
      if(Object(info).status === 203){
        const toast = await this.toast.create({
          header: 'Upload Failed',
          message: 'Uploaded file was not a valid image',
          // icon: 'alert',
          color: 'warning',
          buttons: [{
            icon: 'close',
            role: 'cancel'
          }]
        });
        toast.present();
        this.filedata = '';
        this.quicksendform.reset();
        this.quicksend = false;
      }

      if(Object(info).status === 200){
        const toast = await this.toast.create({
          header: 'Referral Sent',
          message: 'Referral slip uploaded successfully',
          color: 'success',
          buttons: [
            {
              icon: 'close',
              role: 'cancel'
            }
          ]
        });
        toast.present();
        this.filedata = '';
        this.quicksendform.reset();
        this.quicksend = false;
        this.fetchhomedata();
      }

    });
  }

  convertBlobToBase64 = (blob: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  private async picturetaken(photo: Photo){


    const base64Data = await this.readAsBase64(photo);

  }

  private async readAsBase64(photo: Photo){
    if(this.platform.is('hybrid')){
      const file = await Filesystem.readFile({
        path: photo.path,
      });
      return file.data;
    } else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      let postData = new FormData();
      postData.append('file', blob);
      this.filedata = postData;
      postData = null;
      this.quicksendimage = this.sanitizer.bypassSecurityTrustUrl(Capacitor.convertFileSrc(response.url));
      return (await this.convertBlobToBase64(blob)) as string;
    }
  }



}
