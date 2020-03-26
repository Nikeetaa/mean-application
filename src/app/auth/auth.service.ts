import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root"
})

export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
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
    this.http.post<{token: string, expiresIn: number}>(
      'http://localhost:3001/api/user/login',
      authdata
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if(token) {
          const expriresIn = response.expiresIn;
          // set the timer
          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expriresIn * 1000);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
    })
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false); //sends all users of subscription that value is changed
    clearTimeout(this.tokenTimer); // clear timer if manually logged out
    this.router.navigate(['/']);
  }
}
