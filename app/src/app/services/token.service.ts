import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private storage: StorageService
  ) {}

  decodenewtoken(token){
     const helper = new JwtHelperService();
     return helper.decodeToken(token);
    }

  async decodelocaltoken(param){
    const helper = new JwtHelperService();
    return helper.decodeToken(this.storage.getItem(param));
  }



}
