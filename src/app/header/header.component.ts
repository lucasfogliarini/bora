import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DivagandoApiService } from '../divagando-api.service';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  account = new Account;
  constructor(private divagandoApiService: DivagandoApiService,
              private activeRoute: ActivatedRoute) {
                var user = this.activeRoute.snapshot.params['user'];
                this.divagandoApiService.getAccount(user, (account: Account)=>{
                  this.account = account;
                });
  }
}
