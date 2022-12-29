import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const baseurl = 'http://localhost:8080';
// const baseurl = 'https://crazy-black.51-210-240-92.plesk.page';
@Injectable({
  providedIn: 'root'
})
export class CallsService {
    // private baseurl = 'https://crazy-black.51-210-240-92.plesk.page/web';
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
