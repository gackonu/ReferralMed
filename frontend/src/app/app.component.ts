import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CallsService } from './services/calls.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  messageform!: FormGroup;

  messagerecieved = false;

  constructor(
    private calls: CallsService,
    private fb: FormBuilder
  ){}


  ngOnInit(){
    this.messageform = this.fb.group({
        name: [null, [Validators.required, Validators.minLength(3)]],
        subject: [null, []],
        email: [null, [Validators.required, Validators.email]],
        message: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  sendmessage(){
    this.calls.postrequest('sendmessage', this.messageform.value).subscribe(info => {
      this.messagerecieved = true;
      this.messageform.reset();
    })
    
  }
}
