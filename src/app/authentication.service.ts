import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { AuthenticationDialogComponent } from './authentication-dialog/authentication-dialog.component';
import { BoraApiService } from './bora-api.service';
import { Account } from './models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user?: SocialUser;
  account = new Account;
  afterGetJwt?: (dialog: MatDialog) => void;
  constructor(private authService: SocialAuthService,
              private toastr: ToastrService,
              private dialog: MatDialog,
              private boraApiService: BoraApiService) {
              }
  subscribeAuth(){
    this.authService.authState.subscribe(user => {
      this.user = user;
      if(user){
        this.getJwtAndSave(user).then(e=>{
          if(this.afterGetJwt)
            this.afterGetJwt(this.dialog);
          var accountUri = `accounts?filter=contains(Email,'${user.email}')`;
          this.boraApiService.get<Account[]>(accountUri, (accounts) => {
            if(accounts.length){
              this.account = accounts[0];
            }else{
              this.toastr.warning('Usuário não encontrado.');
            }
          });
        });
      }
    });
  }
  async getJwtAndSave(user: SocialUser){
    const jwt = localStorage.getItem("jwt");
    if(!jwt){
      var tokenUri = `token`;
      const authentication = await this.boraApiService.postPromise(tokenUri, user);
      localStorage.setItem("jwt", authentication.jwToken);
    }
  }
  signInWithGoogle(afterGetJwt?: (dialog: MatDialog) => void){
    this.afterGetJwt = afterGetJwt;
    this.dialog.open(AuthenticationDialogComponent, {
      enterAnimationDuration: '1s',
      exitAnimationDuration: '1s',
    });
  }

  async getAccessToken(): Promise<string> {
    let accessToken = await this.authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID);
    return accessToken
  }

  signOut(): void {
    this.authService.signOut();
    localStorage.removeItem("jwt");
  }
  authorizeCalendar(){
    var authUrl = `${environment.boraApi}accounts/authorizeCalendar?redirectUrl=${window.location.origin}/${this.account.username}`;
    window.open(authUrl, '_blank');
  }
  unauthorizeCalendar(){
    this.boraApiService.patch_(`accounts/unauthorizeCalendar`, (account) => {
      this.account.calendarAuthorized = false;
      this.toastr.success('Acesso a sua agenda do Google foi revogado.');
    });
  }
}
