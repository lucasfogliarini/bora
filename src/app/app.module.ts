//modules
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { ToastrModule } from 'ngx-toastr';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { GoogleMapsModule } from '@angular/google-maps';

//components
import { AppComponent } from './app.component';
import { EventsComponent } from './events/events.component';
import { AccountComponent } from './account/account.component';
import { MapComponent } from './map/map.component';
import { HomeComponent } from './home/home.component';
import { EventCreateComponent } from './event-create/event-create.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { SideBarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { ScenariosComponent } from './scenarios/scenarios.component';
import { ContactComponent } from './contact/contact.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { FooterComponent } from './footer/footer.component';
import { BoraComponent } from './bora/bora.component';

import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { HttpRequestInterceptor } from './httprequest.interceptor';
import { registerLocaleData } from '@angular/common';
import localePT from '@angular/common/locales/pt';
registerLocaleData(localePT);
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
        faPeopleGroup,
        faUser,
        faAt,
        faCamera,
        faCircleXmark,
        faComments,
        faArrowsRotate,
        faCalendarCheck,
        faBookOpen,
        faBackward,
        faForward,
        faLeftLong,
        faCameraRetro,
        faHeadset, 
        faEarth,
        faEarthAmericas,
        faChessKing,
        faChessBoard,
        faChessKnight,
        faChessQueen,
        faHourglassStart,
        faHourglassHalf,
        faGlasses} from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faWhatsapp, faInstagram, faSpotify, faLinkedin, faGithub, faYoutube, faDiscord } from '@fortawesome/free-brands-svg-icons';
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
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
    ScenariosComponent
  ],
  imports: [
    GoogleMapsModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    GooglePlaceModule,
    ToastrModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      cancelButtonType: '',
      confirmButtonType: 'dark',
      cancelText: "Cancelar",
      confirmText: "Confirmar"
    }),
    SocialLoginModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/map', pathMatch: 'full' },
      { path: 'map',  component: MapComponent },
      { path: 'bora',  component: BoraComponent },
      { path: 'scenarios',  component: ScenariosComponent },
      { path: ':user',  component: AccountComponent },
      { path: 'privacy',  component: PrivacyComponent },
      { path: 'home', component: HomeComponent }
    ]),
    FontAwesomeModule
  ],
  providers: [
              DatePipe,
              { provide: APP_BASE_HREF, useValue: '/'},
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
      faGlasses,
      faHourglassStart,
      faHourglassHalf,
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
      faDiscord,
      faYoutube,
      faChessKnight,
      faChessKing,
      faChessQueen,
      faPeopleLine,
      faEarthAmericas,
      faUser,
      faAt,
      faCamera,
      faCircleXmark,
      faComments,
      faArrowsRotate,
      faCalendarCheck,
      faBookOpen,
      faBackward,
      faForward,
      faLeftLong,
      faHeadset,
      faPeopleGroup,
      faCameraRetro
    );
  }
}
