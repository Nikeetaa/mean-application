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
          this.setAuthTimer(expriresIn);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expriresIn * 1000);
          this.saveAuthData(token, expirationDate);
          this.router.navigate(['/']);
        }
    })
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false); //sends all users of subscription that value is changed
    clearTimeout(this.tokenTimer); // clear timer if manually logged out
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem("token", token);
    localStorage.setItem("expirationDate", expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expirationDate");
    if(!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }

  autoAuthUser() {
    const authData = this.getAuthData();
    if(!authData) {
      return;
    }

    const now = new Date();
    const expiresIn = authData.expirationDate.getTime() - now.getTime();

    if(expiresIn > 0) {
      this.token = authData.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  setAuthTimer(duration: number) {
    // set the timer
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
