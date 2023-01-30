import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-towns',
  templateUrl: './towns.page.html',
  styleUrls: ['./towns.page.scss'],
})
export class TownsPage implements OnInit {
  townid!: any;
  ready = false;
  hosptials: any;
  location!: string;
  newhospitalform: FormGroup;
  adding = false;

  constructor(
    private calls: CallsService,
    private activatedroute: ActivatedRoute,
    private fb: FormBuilder,
    private toast: ToastController
  ) {
    this.townid = this.activatedroute.snapshot.params.id;
   }

  ngOnInit() {
    this.gethospitals();
    this.newhospitalform = this.fb.group({
      hospitalname: [null, [Validators.required, Validators.minLength(3)]],
      hospitallocationid: [null],
      hospitallocationname: [null],
    });
    console.log(this.newhospitalform.value);

  }

  ionViewWillEnter(){
    this.gethospitals();
  }

  gethospitals(){
    this.calls.getrequest('/gethospitals/'+this.activatedroute.snapshot.params.id).subscribe(info => {
      if(Object(info).status === 200){
        if(Object(info).hospitals.length){
          this.hosptials = Object(info).hospitals;
        }
        this.location = Object(info).location;
      } else {
        this.hosptials = null;
      }
      this.ready = true;
    });
  }

  addHospital(){
    this.newhospitalform.patchValue({hospitallocationid: this.townid});
    this.newhospitalform.patchValue({hospitallocationname: this.location});
    this.calls.postrequest('/addhospital', this.newhospitalform.value).subscribe(async info => {
      if(Object(info).status === 304){
        const toast = await this.toast.create({
          message: 'Hospital Already Present',
          header: 'Error',
          color: 'danger',
          duration: 3500,
          buttons: [{
            icon: 'close',
            role: 'cancel'
          }]
        });

        toast.present();

      }
        if(Object(info).status === 200){
          const toast = await this.toast.create({
            message: 'Hospital Added',
            header: 'Success!!',
            color: 'success',
            duration: 3500,
            buttons: [{
              icon: 'close',
              role: 'cancel'
            }]
          });
          toast.present();
        this.newhospitalform.reset();
        this.gethospitals();
      }
    });
  }


}
