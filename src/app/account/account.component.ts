import { Component } from '@angular/core';
import { Event } from '../models/event.model';
import { Account } from '../models/account.model';
import { ActivatedRoute } from '@angular/router';
import { DivagandoApiService } from '../divagando-api.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  account = new Account;
  event: Event = new Event;
  newEvent: Event = new Event;
  constructor(private divagandoApiService: DivagandoApiService,
              private activeRoute: ActivatedRoute) {
                let user = this.getUser();
                this.divagandoApiService.getAccount(user, (account: Account)=>{
                  this.account = account;
                });
  }
  getUser(){
      return this.activeRoute.snapshot.params['user'] || 'lucasfogliarini';
  }
}
