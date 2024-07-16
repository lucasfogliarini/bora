import { Component, ElementRef, ViewChild } from '@angular/core';
import { Statics } from '../statics';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';
import { BoraApiService } from '../bora-api.service';
import { AccountInput } from '../models/account-input.model';
import { ToastrService } from 'ngx-toastr';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: [ 'nav-menu.component.css' ]
})
export class NavMenuComponent {
  news?: string = undefined;
  partners: Account[] = [];
  partnersContent = '';
  partnerActivityDays: number = -30;
  partnerCalendarAuthorized = false;
  isPartner = this.authService.getAccount()?.isPartner;
  togglePartnershipText = this.isPartner ? 'Desativar' : 'Ativar';
  userType = this.isPartner ? 'Parceira(o)' : 'Usuário(o)';
  @ViewChild('profileGear')
  profileGear?: ElementRef;
  @ViewChild('logar')
  logar?: ElementRef;

  partnership: string = `É muito bom ter você como <b>${this.userType}</b> do <b>Bora!</b>
  <br/><br/>
  <small>
  A qualquer momento é possível <b>Ativar</b> e <b>Desativar</b> a <b>Parceria</b>.
  <br />
  <b>Enquanto ativado</b>:
  <br/>
  1. Seu perfil de <b>Parceira(o)</b> será apresentado na lista de <b>Parcerias</b> do <b>Menu Principal a direita</b>
  <br/>
  2. O botão <b>'Bora?'</b> é <b>exibido</b> no seu perfil para que <b>qualquer pessoa entre em contato pelo Google Agenda</b> <a target='_blank' href='https://api.bora.work/accounts/authorizeCalendar'>(caso sua agenda for autorizada)</a>
  <br/>
  <!--3. Você é <b>convidado automaticamente<b/> nos encontros produzidos pelo <a target='_blank' href='/bora.work'><b>bora.work</b></a>-->
  </small>
  
  `;

  constructor(public authService: AuthenticationService,
              private boraApiService: BoraApiService,
              private toastr: ToastrService
  ) {    
    this.news = `${this.formatDate()}, POA`;
    this.boraApiService.getPartners(this.partnerCalendarAuthorized, this.partnerActivityDays, (partners=>{
      this.partners = partners;
      if(partners){
        this.popPartner(partners);
        this.partnersContent = 
        partners.map(e=>
                `<img src='${e.photo}' />&nbsp;<a href='/${e.username}'>${e.name?.split(' ')[0]}</a>
                  <small>
                    ${e.calendarAuthorized ? '>' : ''}
                    ${e.accountability ? e.accountability?.split(' e ')[0] : ''}
                  </small>
                <br />`).join('');
        //`<img src='${e.photo}' />&nbsp;<a href='/${e.username}'>${e.username}</a>&nbsp;<small>${e.accountability?.substring(0,25) ?? ''}</small><br />`).join('');
        //partnersContent += this.partnerInvite();// Quero ser parceiro
        this.partnersContent += `<small><b>${partners.length}</b> Parceira(o)s <b>ativos</b> nos últimos <b>${Math.abs(this.partnerActivityDays)} dias</b></small>
<br />
<br />
<b>Bora ser Parceira(o) com esse time e prosperar!?</b>
        `;
      }
    }));

    this.authService.subscribeAuth();
  }

  togglePartnership(){
    const partnershipPatch: AccountInput = { isPartner: !this.isPartner };
    this.boraApiService.patchAccount(partnershipPatch, (account: any) => {
      const togglePartnership = !this.isPartner ? 'ativada' : 'desativada';
      this.toastr.show(`Muito grato por sua presença! Relogue para ver o efeito.`,`Parceria ${togglePartnership}`);
      this.authService.signOut();
    });
  }
  bePartner(){
    if (this.authService.getAccount() && this.profileGear) {
      this.profileGear.nativeElement.click();
    }else if(this.logar){
      this.logar.nativeElement.click();
    }
  }
  arrayMove(arr: Array<any>, fromIndex: number, toIndex: number) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }
  popPartner(partners: Account[]){
    let aIndex = partners.findIndex(e=>e.username == this.authService.getAccount()?.username);
    if(aIndex > 0){
      this.arrayMove(partners, aIndex, 0);
    }
  }
  formatDate(now?: Date, withTime = true){
    if(typeof now == 'string')
      now = new Date(now);
    now = now ?? new Date();
    const date = now.toLocaleDateString();    
    let timeString = '';
    if(withTime){
      const time = now.toLocaleTimeString();
      timeString = withTime ? `, ${time}` : '';
    }
    const dateString = `${date}${timeString}`;
    return dateString;
  }
  boraUnderstand(){
    const whatsAppLink = Statics.generateLink(`Oi Lucas!
Acessei ${environment.appDefiniteArticle} '${environment.appDomain}'
e gostaria de saber mais informações sobre ${environment.appDefiniteArticle} ${environment.appName}!`, environment.adminPhone);

    window.open(whatsAppLink);
  }
}
