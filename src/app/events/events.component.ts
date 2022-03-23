import { Component } from '@angular/core';
import { Event } from '../models/event.model';
import { ToastrService } from 'ngx-toastr';
import { DivagandoApiService } from '../divagando-api.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html'
})
export class EventsComponent {
  events: Event[] = [];
  event: Event = new Event;
  newEvent: Event = new Event;

  constructor(private divagandoApiService: DivagandoApiService,
              private authService: SocialAuthService,
              private toastr: ToastrService) {
              this.getEvents();
  }
  getEvents(){
    var eventsUri = `events`;
    this.divagandoApiService.get<Event[]>(eventsUri, (events) => {
      this.events = events;
    });
  }
  participate(eventId: string){
    this.divagandoApiService.patch_(`events/${eventId}/participate`, (event) => {
      this.toastr.success('Tá convidado.');
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
  openMaps(place: string){
      var mapsUrl = 'https://www.google.com.br/maps/place/' + place;
      window.open(mapsUrl);
  }
}
