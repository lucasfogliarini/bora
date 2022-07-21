import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../authentication.service';
import { DivagandoApiService } from '../divagando-api.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html'
})
export class SideBarMenuComponent {
  title = '...';
  constructor(private divagandoApiService: DivagandoApiService,
              public authService: AuthenticationService,
              private titleService: Title) {
                this.divagandoApiService.getContentsByDomain('home', homeContents=>{
                    let homeTitle = homeContents.filter(e=>e.key == 'title');
                    if(homeTitle.length){
                      this.title = homeTitle[0].text;
                      this.titleService.setTitle(this.title);
                    }
                });
              }
  openUser(editing: boolean = false){
    var locationPath = this.authService.account?.username;
    if(editing){
      locationPath += `?editing=true`;
    }
    window.location.href = locationPath;
  }
}
