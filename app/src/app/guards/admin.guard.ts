import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanLoad {
  constructor(
    private router: Router,
    private storage: StorageService
  ){}

  async canLoad(): Promise<any>{
    const role = this.storage.getItem('role');
      if(role === 'admin'){
        return true;
      } else {
        this.router.navigate(['facility']);
        return false;
      }
    };
}
