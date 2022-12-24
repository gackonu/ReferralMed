import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CallsService } from '../services/calls.service';

@Component({
  selector: 'ngx-verifyaccount',
  templateUrl: './verifyaccount.component.html',
  styleUrls: ['./verifyaccount.component.scss']
})
export class VerifyaccountComponent implements OnInit {

  token: string;
  ready = false;
  result: any;
  showerrors: any;
  faciltdets: any;
  activatefacility!: boolean;

  info!: FormGroup;

  constructor(
    private calls: CallsService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { 
    this.token = this.route.snapshot.params['token'];
  }

  ngOnInit(): void {
    this.fetchdata();
  }
  
  fetchdata(){
    this.calls.getrequest('verifyaccount/'+this.token).subscribe(info => {
      if(Object(info).status == 200){
        this.result = Object(info);
      }
      if(Object(info).status == 202){
        this.activatefacility = true;
        this.faciltdets = Object(info).details;
        this.setform();
      }
      this.ready = true;
    });
  }

  setform(){
    this.info = this.fb.group({
      firstname: [null, [Validators.required, Validators.minLength(2)]],
      lastname: [null, [Validators.required, Validators.minLength(2)]],
      phonenumber: [null, [Validators.required, Validators.minLength(10)]],
      password: [null, [Validators.required, Validators.minLength(5)]],
      confirmpassword: [null, [Validators.required, Validators.minLength(5)]],
      token: [this.token],
    });
  }

  activataccount(){
    this.calls.postrequest('activatefacility', this.info.value).subscribe(info => {
      if(Object(info).status == 'validationerror'){
        this.showerrors = Object(info).errors
      } else {
        this.activatefacility = false;
        this.result = Object(info);
      }
    });
  }

  closealert(){
    this.showerrors = null;
  }

}
