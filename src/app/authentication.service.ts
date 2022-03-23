import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { DivagandoApiService } from './divagando-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user: SocialUser = new SocialUser;
  constructor(private authService: SocialAuthService,
              private divagandoApiService: DivagandoApiService,
              private toastr: ToastrService) {  
                this.authService.authState.subscribe(user => {
                  this.user = user;
                  if(user){
                    var tokenUri = `token`;
                    this.divagandoApiService.post(tokenUri, user, (authentication: any) => {
                      localStorage.setItem("jwt", authentication.jwToken);
                      this.toastr.info('Logado.');
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
}
