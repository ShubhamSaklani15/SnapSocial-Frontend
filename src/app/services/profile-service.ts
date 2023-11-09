import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  imageUrl: string = '';
  constructor(private http: HttpClient) { }

  //update profile image of user
  updateProfileImage(formData: FormData): Observable<any> {
    return this.http.post<any>("http://localhost:3000/update-profile-image/", formData);
  }

  //get profile image of user
  getProfileImage(username: string | null): Observable<any> {
    return this.http.get<any>("http://localhost:3000/get-profile-image/" + username, { responseType: 'blob' as 'json' });
  }
}