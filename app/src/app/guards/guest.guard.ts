import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanLoad {
  constructor(
    private storage: StorageService,
    private router: Router
  ){}

  canLoad(): any {
    const role = this.storage.getItem('role');
      if(!role){
        return true;
      } else {
        this.router.navigateByUrl('/doctor');
      }
  }
}
