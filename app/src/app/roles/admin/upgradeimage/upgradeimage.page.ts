import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-upgradeimage',
  templateUrl: './upgradeimage.page.html',
  styleUrls: ['./upgradeimage.page.scss'],
})
export class UpgradeimagePage implements OnInit {

  referralid: number;
  referraldets: any;
  ready = false;
  upgradeform: FormGroup;
  availableprocedures: any;
  hospital: any;
  baseurl: string;
  procedure: string;

  constructor(
    private route: ActivatedRoute,
    private calls: CallsService,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastController
  ) {
    this.baseurl = this.calls.getbaseurl();
    this.referralid = this.route.snapshot.params.id;
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.fetchreferraldetails();
  }

  fetchreferraldetails(){
    this.calls.getrequest('/referaldetails/'+this.referralid).subscribe(info => {
      if(Object(info).status === 200){
        this.referraldets = Object(info).referraldets;
        this.hospital = Object(info).hospitals;
      }

      this.prepareform();

    });
  }

  prepareform(){
    this.upgradeform = this.fb.group({
      patientname: [null, [Validators.required, Validators.minLength(2)]],
      gender: [null, [Validators.required]],
      patientage: [null, [Validators.required]],
      hospital: [null, [Validators.required, Validators.minLength(2)]],
      type: [null, [Validators.required]],
      procedure: [null, [Validators.required]],
      additionalnotes: [null, []],
      referralid: [this.referralid]
    });
    this.ready = true;

  }

  fetchprocedures(){
    this.calls.getrequest('/fetchprocedures/'+this.upgradeform.value.type).subscribe(async info => {
      this.availableprocedures = Object(info).procedures;
    });
  }

  updaterequest(){
    this.calls.postrequest('/upgradequickreferral', this.upgradeform.value).subscribe(async info => {
      if(Object(info).status === 200){
        const toast = await this.toast.create({
          header: 'Referral Ready',
          message: 'Referral has been updated and can be sent directed to a facility',
          color: 'success',
          buttons: [{icon: 'close', role: 'cancel'}],
          duration: 5000
        });
        await toast.present();
        this.router.navigateByUrl('/admin/home');
      }
    });
  }


}
