import { Component } from '@angular/core';
import { WhatsApp } from '../wa';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';
import { BoraApiService } from '../bora-api.service';
import { AccountInput } from '../models/account-input.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: [ 'nav-menu.component.css' ]
})
export class NavMenuComponent {
  news?: string = undefined;
  constructor(public authService: AuthenticationService,
              private boraApiService: BoraApiService,
              private toastr: ToastrService
  ) {    
    this.news = `${this.getNowString()}, POA`;

    this.authService.subscribeAuth();
  }
  isPartner = this.authService.getAccount()?.isPartner;
  togglePartnershipText = this.isPartner ? 'Desativar' : 'Ativar';
  userType = this.isPartner ? 'Parceira(o)' : 'Usuário(o)';
  partnership: string = `É muito bom ter você como <b>${this.userType}</b> do <b>Bora!</b>
  <br/><br/>
  <small>
  A qualquer momento é possível <b>Ativar</b> e <b>Desativar</b> a <b>Parceria</b>.
  <br />
  <b>Enquanto ativado</b>:
  <br/>
  1. Seu perfil de <b>Parceira(o)</b> será apresentado na lista de <b>Parcerias</b> do <a target='_blank' href='/map'>Mapa na Home</a>
  <br/>
  2. O botão <b>'Bora?'</b> é <b>exibido</b> no seu perfil para que <b>qualquer pessoa entre em contato pelo Google Agenda</b> <a target='_blank' href='https://api.bora.work/accounts/authorizeCalendar'>(caso sua agenda for autorizada)</a>
  <br/>
  <!--3. Você é <b>convidado automaticamente<b/> nos encontros produzidos pelo <a target='_blank' href='/bora.work'><b>bora.work</b></a>-->
  </small>
  `;
  togglePartnership(){
    const partnershipPatch: AccountInput = { isPartner: !this.isPartner };
    this.boraApiService.patchAccount(partnershipPatch, (account: any) => {
        const togglePartnership = !this.isPartner ? 'ativada' : 'desativada';
        this.toastr.show(`Parceria ${togglePartnership} com sucesso! Atualize a página para ver o efeito.`);
        this.authService.signOut();
    });
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
