import { Component } from '@angular/core';
import { Account } from '../models/account.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BoraApiService } from '../bora-api.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication.service';
import { EventCreateComponent } from '../event-create/event-create.component';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Responsibility } from '../models/responsibility.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  env = environment;
  account = new Account;
  pastObserversMessage?: string;
  futureObserversMessage?: string;
  eventCreate!: EventCreateComponent;
  selectedResponsibilities: Responsibility[] = [{ id: "1", title: "QA"}];

  constructor(private boraApiService: BoraApiService,
              public authService: AuthenticationService,
              private toastr: ToastrService,
              private router: Router,
              private title: Title,
              private activeRoute: ActivatedRoute) {
                let user = this.getUser();
                this.boraApiService.getAccount(user, (account: Account)=>{
                  this.account = account;
                  this.title.setTitle(`${account.name} no ${this.env.appName}`);
                });
  }
  changeResponsibility(){

  }
  changePartnership(){
    this.boraApiService.patch<Account>(`accounts`, this.account, () => {
      this.toastr.success('Perfil atualizado.');
   });
  }
  whyRevokeCalendar(){
    var whatsAppApi = `https://api.whatsapp.com/send?phone=${environment.adminPhone}&text=Olá, estou revogando meu acesso ao Google Agenda por que ...`;
    var aHref = `<a href='${whatsAppApi}' target='_blank'>Por que está revogando acesso a sua agenda?</a>`;
    return aHref;
  }
  unauthorizeCalendar(){
    this.authService.unauthorizeCalendar();
  }
  getUser(){
    return this.activeRoute.snapshot.url[0].path || 'lucasfogliarini';
  }
  updateAccount(){
    this.boraApiService.patch<Account>(`accounts`, this.account, () => {
       this.toastr.success('Perfil atualizado.');
       this.router.navigate([this.account.username]);
    });
  }
  openGoogleConta(){
    window.open('https://myaccount.google.com/personal-info', '', 'popup');
  }
}
