import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DivagandoApiService } from '../divagando-api.service';
import { Account } from '../models/account.model';
import { ODataResponse } from '../models/odata-response.interface';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html'
})
export class NavMenuComponent {
  account = new Account;
  constructor(private divagandoApiService: DivagandoApiService,
              private activeRoute: ActivatedRoute) {
                var user = this.activeRoute.snapshot.params['user'];
                var account = `odata/accounts?$filter=contains(Email,'${user}')`;
                this.divagandoApiService.get<ODataResponse<Account>>(account, (account) => {
                  this.account = account.value[0];
                });
  }
  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
