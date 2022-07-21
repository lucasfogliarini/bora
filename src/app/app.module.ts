import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';//depends on: @angular/cdk
import { ToastrModule } from 'ngx-toastr';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { AppComponent } from './app.component';
import { EventsComponent } from './events/events.component';
import { HomeComponent } from './home/home.component';
import { HttpRequestInterceptor } from './httprequest.interceptor';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { EventCreateComponent } from './event-create/event-create.component';
import { SideBarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTicket,
        faDoorOpen, 
        faMapLocationDot,
        faPenToSquare, 
        faMapPin,
        faCalendarDay,
        faCalendarPlus,
        faBars,
        faSignOutAlt,
        faLock,
        faLockOpen,
        faPeopleLine,
        faUser,
        faAt,
        faCamera,
        faCircleXmark,
        faComments,
        faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faWhatsapp, faInstagram, faSpotify, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { AccountComponent } from './account/account.component';
import { registerLocaleData } from '@angular/common';
import localePT from '@angular/common/locales/pt';
import { ContactComponent } from './contact/contact.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { FooterComponent } from './footer/footer.component';
import { BoraComponent } from './bora/bora.component';
import { EventOrderComponent } from './event-order/event-order.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
registerLocaleData(localePT);

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    SideBarMenuComponent,
    HomeComponent,
    EventCreateComponent,
    EventsComponent,
    AccountComponent,
    ContactComponent,
    PrivacyComponent,
    FooterComponent,
    BoraComponent,
    EventOrderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    FormsModule,
    GooglePlaceModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      cancelButtonType: '',
      confirmButtonType: 'dark',
      cancelText: "Cancelar",
      confirmText: "Confirmar"
    }),
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    SocialLoginModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'privacy',  component: PrivacyComponent },
      { path: 'bora',  component: BoraComponent },
      { path: ':user',  component: AccountComponent }
    ]),
    FontAwesomeModule
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: '/'},
              { provide: OWL_DATE_TIME_LOCALE, useValue: 'pt-BR'},
              { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
              {
                provide: 'SocialAuthServiceConfig',
                useValue: {
                  autoLogin: true,
                  providers: [
                    {
                      id: GoogleLoginProvider.PROVIDER_ID,
                      provider: new GoogleLoginProvider(
                        '1037813106930-vdf1p42ovuatjt5qvjbn4qtfq973tqos.apps.googleusercontent.com'
                      )
                    }
                  ]
                } as SocialAuthServiceConfig,
              }],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faTicket,
      faLock,
      faLockOpen,
      faDoorOpen,
      faMapLocationDot,
      faPenToSquare,
      faMapPin,
      faCalendarDay,
      faBars,
      faSignOutAlt,
      faGoogle,
      faLinkedin,
      faGithub,
      faCalendarPlus,
      faWhatsapp,
      faInstagram,
      faSpotify,
      faPeopleLine,
      faUser,
      faAt,
      faCamera,
      faCircleXmark,
      faComments,
      faArrowsRotate
    );
  }
}
