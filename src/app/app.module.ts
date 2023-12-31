import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
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
        faHeadset } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faWhatsapp, faInstagram, faSpotify, faLinkedin, faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { AccountComponent } from './account/account.component';
import { registerLocaleData } from '@angular/common';
import localePT from '@angular/common/locales/pt';
import { ContactComponent } from './contact/contact.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { FooterComponent } from './footer/footer.component';
import { BoraComponent } from './bora/bora.component';
import { EventCommentComponent } from './event-comment/event-comment.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMatDatetimePickerModule, 
         NgxMatNativeDateModule, 
         NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { AuthenticationDialogComponent } from './authentication-dialog/authentication-dialog.component';
import { ScenariosComponent } from './scenarios/scenarios.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

registerLocaleData(localePT);

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    AuthenticationDialogComponent,
    SideBarMenuComponent,
    HomeComponent,
    EventCreateComponent,
    EventCommentComponent,
    EventsComponent,
    AccountComponent,
    ContactComponent,
    PrivacyComponent,
    FooterComponent,
    BoraComponent,
    ScenariosComponent
  ],
  imports: [
    BrowserModule,
    MatSlideToggleModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatSliderModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    MatInputModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
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
      { path: 'privacy',  component: PrivacyComponent },
      { path: 'bora',  component: BoraComponent },
      { path: 'scenarios',  component: ScenariosComponent },
      { path: ':user',  component: AccountComponent }
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
      faYoutube,
      faPeopleLine,
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
