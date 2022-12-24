import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

const baseurl = 'https://crazy-black.51-210-240-92.plesk.page';
// const baseurl = 'http://localhost:8080';
@Injectable({
  providedIn: 'root'
})
export class CallsService {
  token: any;
  role: any;

  private baseurl = 'https://crazy-black.51-210-240-92.plesk.page/api';
  // private baseurl = 'http://localhost:8080/api';
  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {
    this.rolecheck();
  }

  rolecheck(){
    const info = this.storage.getItem('token');
    const role = this.storage.getItem('role');


      if(info){
          this.token = info;
      } else {
          this.token = null;
      }


      if(role){
        this.role = role;
      } else {
        this.role = null;
      }

  };


  postrequest(url: string, data: any){
    if(this.token != null){
      return this.http.post(`${this.baseurl}/${this.role}`+url, data, {
        headers: new HttpHeaders({
          token: this.token
        })
      });
    } else {
      return this.http.post(`${this.baseurl}/`+url, data);
    }
  }


  getrequest(url: string){
    if(this.token != null){
      return this.http.get(`${this.baseurl}/${this.role}` + url, {
        headers: new HttpHeaders({
          token: this.token
      })
      });
    } else {
      return this.http.get(`${this.baseurl}` + url);
    }

  }

  getbaseurl(){
    return baseurl;
  }

}
