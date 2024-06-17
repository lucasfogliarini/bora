import { Component } from '@angular/core';
import { Account } from '../models/account.model';
import { WhatsApp } from '../wa';
import { environment } from 'src/environments/environment';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: [ 'nav-menu.component.css' ]
})
export class NavMenuComponent {
  user: SocialUser | null = null;
  account = new Account;
  news?: string = "17/06/2024, Porto Alegre, ";
  constructor(public authService: SocialAuthService) {    
    this.news = `${this.getNowString()}, Porto Alegre`;
  }
  getNowString(){
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    const nowString = `${date} - ${time}`;
    return nowString;
  }
  boraUnderstand(){
    const whatsAppLink = WhatsApp.generateLink(`Oi Lucas!
Acessei ${environment.appDefiniteArticle} '${environment.appDomain}'
e gostaria de saber mais informações sobre ${environment.appDefiniteArticle} ${environment.appName}!`, environment.adminPhone);

    window.open(whatsAppLink);
  }
}
