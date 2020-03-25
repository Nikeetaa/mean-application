import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.model';

@Injectable({
  providedIn: "root"
})

export class AuthService {

  private token: string;

  constructor(private http: HttpClient) { }

  getToken() {
    return this.token;
  }

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
    this.http.post<{token: string}>(
      'http://localhost:3001/api/user/login',
      authdata
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
      })
  }
}
