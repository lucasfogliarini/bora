import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html'
})
export class SideBarMenuComponent {
  constructor(public authService: AuthenticationService) {  }
  signInWithGoogle(): void {
    this.authService.signInWithGoogle();
  }
  signOut(): void {
    this.authService.signOut();
    localStorage.removeItem("jwt");
  }
  openUser(){
    var user = this.authService.user?.email?.split('@')[0] || '';
    window.location.pathname = '/' + user;
  }
}
