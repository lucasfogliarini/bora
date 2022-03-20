import { Component } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { DivagandoApiService } from '../divagando-api.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html'
})
export class SideBarMenuComponent {
  user: SocialUser = new SocialUser;
  constructor(private authService: SocialAuthService,
              private divagandoApiService: DivagandoApiService,
              private toastr: ToastrService) {  }

  ngOnInit() {
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
