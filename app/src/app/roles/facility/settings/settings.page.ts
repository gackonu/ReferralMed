import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonModal, ToastController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  facilityinfo: any;
  myprocedures: any;
  ready = false;
  procedureform: FormGroup;

  constructor(
    private calls: CallsService,
    private toast: ToastController,
    private alert: AlertController,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.fetchdata();
    this.procedureform = this.fb.group({
      procedurename: [null, [Validators.required, Validators.minLength(2)]],
      price: [null, [Validators.required, Validators.minLength(1)]],
      referral: [null, [Validators.required, Validators.minLength(1)]],
    });
  }

  addprocedure(){
    this.calls.postrequest('/addprocedure', this.procedureform.value).subscribe(info => {

      if(Object(info).status === 200){
        this.fetchdata();
      }
    });
  }

  ionViewWillEnter(){
    this.fetchdata();
  }

  fetchdata(){
    this.calls.getrequest('/settings').subscribe(info => {
      this.facilityinfo = Object(info).facilityinfo;
      if(Object(info).procedures.length){
        this.myprocedures = Object(info).procedures;
      }
      this.ready = true;
      console.log(this.facilityinfo);
    });
  }

  cancel(){
    this.modal.dismiss(null, 'cancel');
  }

}
