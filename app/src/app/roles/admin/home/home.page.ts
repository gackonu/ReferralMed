import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  pendingreferrals: any;
  ready = false;
  ongoing = false;
  stats: any;
  bottoms: object[] = [
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
    ];


  constructor(
    private calls: CallsService,
    private alert: AlertController,
    private action: ActionSheetController,
    private toast: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.fetchdata();
  }

  ionViewWillEnter(){
    this.fetchdata();
  }

  fetchdata(){
    this.calls.getrequest('/homepage').subscribe(info => {
      if(Object(info).pendingreferrals.length){
        this.pendingreferrals = Object(info).pendingreferrals;
      } else {
        this.pendingreferrals = null;
      }

      if(Object(info).ongoingreferrals > 0){
        this.ongoing = true;
      } else {
        this.ongoing = false;
      }

      this.stats = Object(info).stats;


      this.ready = true;
    });
  }

  async cancelreferral(id, patientname){
    const alert = await this.alert.create({
      header: 'Confirm Cancellation',
      message: 'Are you sure you want to cancel '+patientname+'\'s referral?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.sendcancel(id);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  sendcancel(id){
    this.calls.getrequest('/cancelreferral/'+id).subscribe(info => {
      if(Object(info).status === 200){
        this.fetchdata();
      }
    });
  }

  completeform(id){
    this.router.navigateByUrl('/admin/upgradeimage/'+id);
  }

  addtobotoms(procedureid, facilityname, facilityid){
    this.bottoms.push(
        {
          text: facilityname,
          handler: () => {
            this.sendreferral(procedureid, facilityid);
          }
        }
      );
  }


  async asignto(id, type) {
    this.calls.getrequest('/fetchcenters/'+type).subscribe(async info => {
      if(Object(info).facilities.length){
        Object(info).facilities.forEach(element => {
          this.addtobotoms(id, element.name, element.facility_id);
        });
      } else {
        this.bottoms = [
          {
            text: 'No '+Object(info).type+' has been added yet',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ];
      }
      const actionSheet = await this.action.create({
        header: Object(info).type,
        buttons: this.bottoms,
      });
      await actionSheet.present();
      this.bottoms = [
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ];
    });

  }

  sendreferral(procedureid, facilityid){
    this.calls.getrequest('/sendreferral/'+procedureid+'/'+facilityid).subscribe(async info => {

      if(Object(info).status === 200){
        const toast = await this.toast.create({
          header: 'Referral Sent',
          message: 'Operation Successful. The referral has been sent successfully',
          // icon: 'check',
          color: 'success',
          duration: 3000,
          buttons: [{
            icon: 'close',
            role: 'cancel'
          }],
        });
        toast.present();
      }

      this.fetchdata();

    });
  }

}
