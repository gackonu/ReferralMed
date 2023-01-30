import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const baseurl = 'http://localhost:8080';
// const baseurl = 'https://backend.reefapp.xyz';
@Injectable({
  providedIn: 'root'
})
export class CallsService {
    // private baseurl = 'https://backend.reefapp.xyz/web';
  private baseurl = 'http://localhost:8080/web';
  constructor(
    private http: HttpClient
  ) { }

  postrequest(url: string, data: any){
    return this.http.post(`${this.baseurl}/`+url, data);
  }

  getrequest(url: string){
    return this.http.get(`${this.baseurl}/`+url);
  }

  getbaseurl(){
    return baseurl;
  }
}
