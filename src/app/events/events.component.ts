import { Component } from '@angular/core';
import { Event } from '../models/event.model';
import { ToastrService } from 'ngx-toastr';
import { DivagandoApiService } from '../divagando-api.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html'
})
export class EventsComponent {
  account = new Account;
  events: Event[] = [];
  event: Event = new Event;
  newEvent: Event = new Event;

  constructor(private divagandoApiService: DivagandoApiService,
              private authService: SocialAuthService,
              private toastr: ToastrService,
              private activeRoute: ActivatedRoute) {
              this.getEvents();
  }
  getEvents(){
    var user = this.activeRoute.snapshot.params['user'];
    this.divagandoApiService.getAccount(user, (account: Account)=>{
      this.account = account;
    });

    var eventsUri = `events?user=${user}`;
    this.divagandoApiService.get<Event[]>(eventsUri, (events) => {
      this.events = events;
    }, (errorResponse)=>{
        //usuário não existe ou Calendário não autorizado
    });
  }
  participate(eventId: string){
    var user = this.activeRoute.snapshot.params['user'];
    this.divagandoApiService.patch_(`events/${eventId}/participate?user=${user}`, (event) => {
      this.toastr.success('Então bora!');
    }, (errorResponse)=>{
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    });
  }
  addressChange(address: Address){
    this.newEvent.location = address.formatted_address;
  }
  openUrl(url: string){
    window.open(url);
  }
  openMaps(place?: string){
      var mapsUrl = 'https://www.google.com.br/maps/place/' + place;
      window.open(mapsUrl);
  }
  attendees(attendees: string[]){
    return attendees?.map(e=>`<a href="${environment.divagando}${e}">${e}</a><br>`).join('');
  }
}
