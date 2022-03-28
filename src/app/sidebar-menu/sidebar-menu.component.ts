import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { DivagandoApiService } from '../divagando-api.service';
import { Account } from '../models/account.model';
import { ODataResponse } from '../models/odata-response.interface';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html'
})
export class SideBarMenuComponent {
  constructor(public authService: AuthenticationService) {}
  openUser(){
    var user = this.authService.user?.email?.split('@')[0] || '';
    window.location.pathname = '/' + user;
  }
}
