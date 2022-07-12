import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication.service';
import { DivagandoApiService } from '../divagando-api.service';
import { EventType } from '../models/event-type.model';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent {
  event: Event = new Event;
  newEvent: Event = new Event;
  placesOptions: Options = new Options;
  titles = ['🥂 Camarote ou festa privada','💰 Empreender','🔮 Criar','🥩 Churrasco e bate-papo','🏞 Viajar ou fazer uma trilha', '📱 Desenvolver um aplicativo'];
  locations = ['🏡 Aqui em casa','🏛 Na Divagando','💻 Google Meet','⛩ Num Quiosque','🏖 Na Praia']

  constructor(private divagandoApiService: DivagandoApiService,
              private authService: AuthenticationService,
              private toastr: ToastrService,
              private activeRoute: ActivatedRoute) {
                this.placesOptions.componentRestrictions = { country: 'br' };
  }
  getEventType(event: Event){
    if(!event.title)
      return undefined;
    if(event.title?.includes('Camarote'))
       return EventType.Party;
    else if(event.title.includes('Empreender') || event.title.includes('Criar') || event.title.includes('Churrasco') || event.title.includes('Desenvolver'))
       return EventType.Career;
    else if(event.title.includes('Viajar'))
       return EventType.Travel;
    else if(event.title.includes('Jogar'))
       return EventType.Game;
    else
       return EventType.Any;
 }
  create(){
    const jwt = localStorage.getItem("jwt");
    if(!jwt){
      this.authService.signInWithGoogle();
    }
    var user = this.activeRoute.snapshot.params['user'];
    this.newEvent = new Event();
    this.divagandoApiService.post<Event>(`events?user=${user}`, this.newEvent, (event) => {
      this.event.id = event.id;
      this.event.attendeeEmails = event.attendeeEmails;
      this.newEvent = new Event;
    });
  }
  update(pub: boolean = false){
    var user = this.activeRoute.snapshot.params['user'];
    this.newEvent.public = pub;
    this.newEvent.eventType = this.getEventType(this.newEvent);
    this.divagandoApiService.patch<Event>(`events/${this.event.id}?user=${user}`, this.newEvent, (event) => {
      this.event = event;
      this.newEvent = new Event();
      if(!event.location){
        this.getCurrentPlace();
      }
      if(this.event.public){
        this.toastr.success('Bora então!');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        this.event = new Event;
      }
    });
  }
  addressChange(address: Address){
    this.newEvent.location = address.formatted_address;
  }

  getCurrentPlace(){
    window.navigator.geolocation.getCurrentPosition(position =>{
      //@ts-ignore
      var geocoder = new google.maps.Geocoder();
      //@ts-ignore
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      //@ts-ignore
      geocoder.geocode({'location': latLng }, addresses =>{
        this.newEvent.location = addresses[0].formatted_address;
      });
    }, error =>{
      //error.code 1 You've decided not to share your position, but it's OK. We won't ask you again.
      //error.code 2 The network is down or the positioning service can't be reached.
      //error.code 3 The attempt timed out before it could get the location data.
      //else Geolocation failed due to unknown error.;
    });
  }

  close(){
    this.event = new Event;
  }
}
