import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user : string = '';

  constructor(public authService: AuthService, private cookieService: CookieService) {}

  ngOnInit(): void {
    
  }

  isLoggedIn(): boolean{
    this.user = this.cookieService.get('user');
    return (this.cookieService.get('loggedIn') == 'true');
    //this.user = this.cookieService.get('user');
  }

  async logout(){
    await this.authService.logout();
  }

}
