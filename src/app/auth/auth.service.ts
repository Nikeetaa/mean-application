import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.model';

@Injectable({
  providedIn: "root"
})

export class AuthService {

  constructor(private http: HttpClient) { }

  createUser(email: string, password: string) {
    const authdata : AuthData = {email, password};
    this.http.post<{message: string, data: AuthData}>(
      'http://localhost:3001/api/user/signup',
      authdata
      ).subscribe(response => {
        console.log(response);
      });
  }

  login(email: string, password: string) {
    const authdata : AuthData = {email, password};
    this.http.post(
      'http://localhost:3001/api/user/login',
      authdata
      )
      .subscribe(response => {
        console.log(response);
      })
  }
}
