import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';
import { BoraApiService } from '../bora-api.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html'
})
export class SideBarMenuComponent  implements OnInit {
  title = 'Bora';
  constructor(private boraApiService: BoraApiService,
              public authService: AuthenticationService,
              private titleService: Title) {
                this.titleService.setTitle(environment.appName);
                /*this.boraApiService.getContentsByDomain('home', homeContents=>{
                    let homeTitle = homeContents.filter(e=>e.key == 'title');
                    if(homeTitle.length){
                      this.title = homeTitle[0].text;
                      this.titleService.setTitle(this.title);
                    }
                });*/
              }
  ngOnInit(): void {
    this.authService.subscribeAuth();
  }
  openUser(editing: boolean = false){
    var locationPath = this.authService.account?.username;
    if(editing){
      locationPath += `?editing=true`;
    }
    window.location.href = locationPath;
  }
}
