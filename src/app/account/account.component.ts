import { Component } from '@angular/core';
import { Event } from '../models/event.model';
import { Account } from '../models/account.model';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { DivagandoApiService } from '../divagando-api.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  account = new Account;
  event: Event = new Event;
  editing: boolean = false;
  newEvent: Event = new Event;
  constructor(private divagandoApiService: DivagandoApiService,
              public authService: AuthenticationService,
              private toastr: ToastrService,
              private router: Router,
              private activeRoute: ActivatedRoute) {
                let user = this.getUser();
                this.divagandoApiService.getAccount(user, (account: Account)=>{
                  this.account = account;
                });
                this.router.events.subscribe(e=>{
                  if(e instanceof ActivationEnd){
                    this.editing = e.snapshot.queryParams['editing'] === 'true';
                  }
                });
  }
  getUser(){
    return this.activeRoute.snapshot.params['user'] || 'lucasfogliarini';
  }
  updateAccount(){
    this.account.whatsApp = this.account.whatsApp ?? '';
    this.divagandoApiService.patch<Account>(`accounts`, this.account, () => {       
       this.editing = false;
       this.toastr.success('Perfil atualizado!');
       this.router.navigate([this.account.username]);
    });
  }
  openGoogleConta(){
    window.open('https://myaccount.google.com/personal-info', '', 'popup');
  }
}
