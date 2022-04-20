import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DivagandoApiService } from '../divagando-api.service';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  account = new Account;
  constructor(private divagandoApiService: DivagandoApiService,
              private toastr: ToastrService,
              private activeRoute: ActivatedRoute) {
                var user = this.activeRoute.snapshot.params['user'];
                var account = `accounts?$filter=contains(Email,'${user}')`;
                this.divagandoApiService.get<Account[]>(account, (accounts) => {
                  if(accounts.length){
                    this.account = accounts[0];
                  }else{
                    this.toastr.warning('Usuário não encontrado.');
                  }
                });
  }
}
