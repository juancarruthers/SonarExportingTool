import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user = '';

  constructor(public authService: AuthService, private cookieService: CookieService) {}

  ngOnInit(): void {
  }

  isLoggedIn(): boolean{
    if (this.cookieService.get('logged') == 'true'){
      this.user = this.cookieService.get('user');
      return true;
    }else{
      return false;
    }
  }

}
