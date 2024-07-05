import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { BoraApiService } from './bora-api.service';
import { Account } from './models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user?: SocialUser;
  constructor(private authService: SocialAuthService,
              private toastr: ToastrService,
              private boraApiService: BoraApiService) {
              }

  getAccount(): Account | undefined{
    const boraAccountJson = localStorage.getItem(Account.boraAccountJson);
    if(boraAccountJson){
      var boraAccount = JSON.parse(boraAccountJson) as Account;
      return boraAccount;
    }
    return undefined;
  }              
  subscribeAuth(){
    this.authService.authState.subscribe(boraSocialUser => {
      if(boraSocialUser){
        this.registerLogin(boraSocialUser);
      }
    });
  }
  async registerLogin(boraSocialUser: SocialUser){
    const jwt = localStorage.getItem(Account.boraAccountJwt);
    if(!jwt){
      var tokenUri = `token`;
      const authentication = await this.boraApiService.postPromise(tokenUri, boraSocialUser);
      localStorage.setItem(Account.boraAccountJwt, authentication.jwToken);
    }
    var accountUri = `accounts?filter=contains(Email,'${boraSocialUser.email}')`;
    this.boraApiService.get<Account[]>(accountUri, (accounts) => {
      location.reload();
      if(accounts.length){
        const account = accounts[0];
        localStorage.setItem(Account.boraAccountJson, JSON.stringify(account));
      }else{
        this.toastr.warning('Usuário não encontrado.');
      }
    });
  }
  signInWithGoogle(){
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  async getAccessToken(): Promise<string> {
    let accessToken = await this.authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID);
    return accessToken
  }

  signOut(): void {
    this.authService.signOut();
    localStorage.removeItem(Account.boraAccountJwt);
    localStorage.removeItem(Account.boraAccountJson);
  }
  authorizeCalendar(){
    var authUrl = `${environment.boraApi}accounts/authorizeCalendar?redirectUrl=${window.location.origin}/${this.getAccount()?.username}`;
    window.open(authUrl, '_blank');
  }
  unauthorizeCalendar(){
    this.boraApiService.patch_(`accounts/unauthorizeCalendar`, (account) => {
      this.toastr.success('Acesso a sua agenda do Google foi revogado.');
    });
  }
}
