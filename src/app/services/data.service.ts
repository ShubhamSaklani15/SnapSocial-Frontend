import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  profileImage = new BehaviorSubject<string>("");
  profileImage$ = this.profileImage.asObservable();

  updateProfileImage(profileImage: string) {
    this.profileImage.next(profileImage);
  }
}
