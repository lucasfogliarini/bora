import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DivagandoApiService } from './divagando-api.service';
import { Account } from './models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user?: SocialUser;
  account = new Account;
  constructor(private authService: SocialAuthService,
              private toastr: ToastrService,
              private divagandoApiService: DivagandoApiService) {
                this.authService.authState.subscribe(user => {
                  this.user = user;
                  if(user){
                    const jwt = localStorage.getItem("jwt");
                    if(!jwt){
                      var tokenUri = `token`;
                      this.divagandoApiService.post(tokenUri, user, (authentication: any) => {
                        localStorage.setItem("jwt", authentication.jwToken);
                      });
                    }

                    var accountUri = `accounts?filter=contains(Email,'${user.email}')`;
                    this.divagandoApiService.get<Account[]>(accountUri, (accounts) => {
                      if(accounts.length){
                        this.account = accounts[0];
                      }else{
                        this.toastr.warning('Usuário não encontrado.');
                      }
                    });
                  }
                });
              }
  signInWithGoogle(): Promise<SocialUser> {
    return this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  signOut(): void {
    this.authService.signOut();
    localStorage.removeItem("jwt");
  }
  authorizeCalendar(){
    var authUrl = `${environment.divagandoApi}accounts/authorizeCalendar?redirectUrl=${environment.divagando}/${this.account.username}`;
    window.open(authUrl, '_blank');
  }
  unauthorizeCalendar(){
    this.divagandoApiService.patch_(`accounts/unauthorizeCalendar`, (account) => {
      this.account.calendarAuthorized = false;
      this.toastr.success('Acesso a sua agenda do Google foi revogado.');
    });
  }
}
