import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CallsService } from '../services/calls.service';

@Component({
  selector: 'ngx-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {
  ready = false;
  token: string;
  result: any;
  valid = false;
  userdetails: any;
  showerrors: any;
  passwordresetform!: FormGroup;
  constructor(
    private calls: CallsService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.token = this.route.snapshot.params['token'];
   }

  ngOnInit(): void {
    this.fetchdata();
  }

  fetchdata(){
    this.calls.getrequest('verifyresettoken/'+this.token).subscribe(info => {
      this.ready = true;
      if(Object(info).status == 200){
        this.result = Object(info);
      }
      if(Object(info).status == 202){
        this.prepareform();
        this.valid = true;
        this.userdetails = Object(info).userdetails;
      }
    })
  }

  prepareform(){
    this.passwordresetform = this.fb.group({
      password: [null, [Validators.required, Validators.minLength(5)]],
      confirmpassword: [null, [Validators.required, Validators.minLength(5)]],
      token: [this.token],
    })
  }

  resetpassword(){
    this.calls.postrequest('resetpassword', this.passwordresetform.value).subscribe(info => {
      if(Object(info).status == 'validationerror'){
        this.showerrors = Object(info).errors
      } else {
        this.showerrors = null;
        this.result = Object(info);
        this.valid = false;
      }
    })
  }

}
