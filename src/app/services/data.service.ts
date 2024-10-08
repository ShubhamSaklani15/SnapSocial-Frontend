import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private profileImage = new BehaviorSubject<string>("");

  private newPostSubject = new BehaviorSubject<void>(undefined);

  updateProfileImage(profileImage: string) {
    this.profileImage.next(profileImage);
  }

  updatePosts() {
    this.newPostSubject.next();
  }

  getNewPostObservable() {
    return this.newPostSubject.asObservable();
  }

  getProfileImageObservable() {
    return this.profileImage.asObservable();
  }
}
