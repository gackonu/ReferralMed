import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem } from '@capacitor/filesystem';
import { Platform, ToastController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-reportsingle',
  templateUrl: './reportsingle.page.html',
  styleUrls: ['./reportsingle.page.scss'],
})
export class ReportsinglePage implements OnInit {


  reportid: number;
  baseurl: string;
  reportdetails: any;
  ready = false;
  chosefile = false;
  pictureset = false;
  addedfile= false;
  filesrc: string;
  reportpreview: any;
  filedata: any = '';
  reportform: FormGroup;

  constructor(
    private calls: CallsService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toast: ToastController,
    private platform: Platform,
    private sanitizer: DomSanitizer
  ) {
    this.reportid =  this.activatedroute.snapshot.params.id;
    this.baseurl = this.calls.getbaseurl();
  }

  ngOnInit() {
    this.setupform();
  }

  setupform(){
    this.reportform = this.fb.group({
      reportid: [this.reportid]
    });
  }

  ionViewWillEnter(){
    this.fetchdata();
  }

  fetchdata(){
    this.calls.getrequest('/reportsdetails/'+this.reportid).subscribe(info => {
      if(Object(info).status === 200){
        this.reportdetails = Object(info).reportdetails;
      } else {
        this.router.navigateByUrl('/facility/home');
      }
      this.ready = true;
    });
  }

  sendreport(){
    this.calls.postrequest('/generatereport', this.reportform.value).subscribe(info => {
      if(Object(info).status === 200){
        console.log(info);
      }
    });
  }

  updatereport(){
    this.filedata.append('reportid', this.reportform.value.reportid);
    this.calls.postrequest('/updatereport', this.filedata).subscribe(async info => {

      if(Object(info).status === 200){
        const toast = await this.toast.create({
          header: 'Report Update',
          message: 'Report Updated Succefully',
          color: 'success',
          icon: 'checkmark',
          duration: 2000
        });
        toast.present();
        this.router.navigateByUrl('/facility/completedreferrals');
      }
      if(Object(info).status === 203){
        const toast = await this.toast.create({
          header: 'Report Update Failed',
          message: 'Uploaded Image was of an invalid format',
          color: 'warning',
          icon: 'alert',
          duration: 2000
        });
        toast.present();
      }
    });
  }

  async takepicture(){
    const capturedphoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const savedimagefile = await this.picturetaken(capturedphoto);
    this.pictureset = true;
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
      this.reportpreview = this.sanitizer.bypassSecurityTrustUrl(Capacitor.convertFileSrc(response.url));
      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

}
