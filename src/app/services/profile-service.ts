import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constants } from '../utility/constants';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  apiUrl = constants.apiUrl;

  constructor(private http: HttpClient) { }

  //update profile image of user
  updateProfileImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-profile-image/`, formData);
  }

  //get profile image of user
  getProfileImage(username: string | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-profile-image/` + username, { responseType: 'blob' as 'json' });
  }
}