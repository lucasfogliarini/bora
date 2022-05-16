import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html'
})
export class SideBarMenuComponent {
  constructor(public authService: AuthenticationService) {}
  openUser(editing: boolean = false){
    var locationPath = this.authService.account?.username;
    if(editing){
      locationPath += `?editing=true`;
    }
    window.location.href = locationPath;
  }
}
