import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { DivagandoApiService } from './divagando-api.service';
import { Account } from './models/account.model';
import { ODataResponse } from './models/odata-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user: SocialUser = new SocialUser;
  account = new Account;
  constructor(private authService: SocialAuthService,
              private toastr: ToastrService,
              private divagandoApiService: DivagandoApiService) {
                this.authService.authState.subscribe(user => {
                  this.user = user;
                  if(user){
                    var tokenUri = `token`;
                    this.divagandoApiService.post(tokenUri, user, (authentication: any) => {
                      localStorage.setItem("jwt", authentication.jwToken);
                    });
                    var account = `odata/accounts?$filter=Email eq '${user.email}'`;
                    this.divagandoApiService.get<ODataResponse<Account>>(account, (account) => {
                      this.account = account.value[0];
                    });
                  }
                });
              }
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  signOut(): void {
    this.authService.signOut();
    localStorage.removeItem("jwt");
  }
  authorizeCalendar(){
    this.divagandoApiService.patch_(`accounts/${this.user.email}/calendar/authorize`, (account) => {
      this.toastr.success('Calendário autorizado para ver e criar eventos.');
    });
  }
  unauthorizeCalendar(){
    this.divagandoApiService.patch_(`accounts/${this.user.email}/calendar/unauthorize`, (account) => {
      this.toastr.success('Calendário desautorizado!');
    });
  }
}
