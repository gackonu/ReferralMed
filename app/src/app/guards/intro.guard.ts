import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanActivate {
  constructor(
    private router: Router,
    private storage: StorageService
  ){}

  canActivate(): boolean {
    const seenintro = this.storage.getItem('seenintro');

    if(!seenintro){
      this.router.navigateByUrl('guest/slides');
      return false;
    }

    return true;
  }
}
