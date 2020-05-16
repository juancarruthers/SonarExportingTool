import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user : string;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  isLoggedIn(): boolean{
    let loggedIn: boolean = false;
    if (localStorage.getItem('loggedIn')){
      this.user = localStorage.getItem('user');
      loggedIn = true;
    }else{
      this.user = '';
    }
    return loggedIn;
  }

  async logout(){
    await this.authService.logout();
  }

}
