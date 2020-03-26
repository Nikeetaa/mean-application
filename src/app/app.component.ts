import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private authService: AuthService) {}

  ngOnInit() {
    //check token on refresh the page
    this.authService.autoAuthUser();
  }

}
