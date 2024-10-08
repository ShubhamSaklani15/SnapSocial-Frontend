import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { constants } from '../utility/constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = constants.apiUrl;
  
  constructor(private http: HttpClient) { }

  //get new users
  getNewUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-new-users`);
  }
}