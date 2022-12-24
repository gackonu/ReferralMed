import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { CallsService } from 'src/app/services/calls.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profiledetails: FormGroup;
  constructor(
    private calls: CallsService,
    private toast: ToastController,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  prepareform(){
    this.profiledetails = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      phonenumber: [null, [Validators.required, Validators.minLength(10)]],
      email: [null, [Validators.required, Validators.email]],
    });
  }


}
