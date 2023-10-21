import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  loginUser(user: UserData): Observable<any> {
    return this.http.post<any>("http://localhost:3000/login", user);
  }

  registerUser(user: UserData): Observable<any> {
    return this.http.post<any>("http://localhost:3000/register", user);
  }
}
