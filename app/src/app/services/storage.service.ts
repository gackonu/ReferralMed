import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // setName = async (keyed, valued) => {
  //   await Preferences.set({
  //     key: keyed,
  //     value: valued,
  //   });
  // };

  // checkName = async (keyed) => ((await Preferences.get({ key: keyed })).value);

  // removeName = async (keyed) => {
  //   await Preferences.remove({ key: keyed });
  // };


  storeItem(key: string, value: string){
    localStorage.setItem(key, value);
    return;
  }

  getItem(value: string){
    return localStorage.getItem(value);
  }

  removeItem(value: string){
    localStorage.removeItem(value);
    return;
  }

}
