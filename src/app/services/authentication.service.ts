import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  //login user
  loginUser(user: UserData): Observable<any> {
    return this.http.post<any>("http://localhost:3000/login", user);
  }

  //generate otp for new account
  generateOtp(user: UserData): Observable<any> {
    return this.http.post<any>("http://localhost:3000/generate-otp", user);
  }

  //validate otp and register user
  registerUser(user: UserData, otp: string): Observable<any> {
    return this.http.post<any>("http://localhost:3000/validate-otp/" + otp, user);
  }

  //set jwt token in local storage
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  //get jwt token from local storage
  getToken() {
    return localStorage.getItem('token');
  }
}
