import { Component } from '@angular/core';
import { WhatsApp } from '../wa';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: [ 'nav-menu.component.css' ]
})
export class NavMenuComponent {
  news?: string = undefined;
  constructor(public authService: AuthenticationService) {    
    this.news = `${this.getNowString()}, POA`;

    this.authService.subscribeAuth();
  }
  getNowString(){
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    const nowString = `${date}, ${time}`;
    return nowString;
  }
  boraUnderstand(){
    const whatsAppLink = WhatsApp.generateLink(`Oi Lucas!
Acessei ${environment.appDefiniteArticle} '${environment.appDomain}'
e gostaria de saber mais informações sobre ${environment.appDefiniteArticle} ${environment.appName}!`, environment.adminPhone);

    window.open(whatsAppLink);
  }
}
