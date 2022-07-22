import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication.service';
import { DivagandoApiService } from '../divagando-api.service';
import { AttendeeReply } from '../models/attendee-reply.model';
import { Content } from '../models/content.model';
import { EventCreate } from '../models/event-create.model';
import { EventType } from '../models/event-type.model';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent {
  event?: Event;
  newEvent: Event = new Event;
  placesOptions: Options = new Options;
  eventCreate: EventCreate = new EventCreate;

  @ViewChild('googlePlace')
  googlePlace?: ElementRef;

  constructor(private divagandoApiService: DivagandoApiService,
              private authService: AuthenticationService,
              private toastr: ToastrService,
              private activeRoute: ActivatedRoute) {
                this.placesOptions.componentRestrictions = { country: 'br' };
                this.setContents();
  }
  getUsername(){
    return this.activeRoute.snapshot.params['user'] || 'lucasfogliarini';
  }
  setContents(){
    const username = this.getUsername();
    this.divagandoApiService.getContents('event-create', username, (contents: Content[])=>{
      let content = contents.find(e=>e.key == 'what');
      if(content) this.eventCreate.what = content.text;
      content = contents.find(e=>e.key == 'where');
      if(content) this.eventCreate.where = content.text;
      content = contents.find(e=>e.key == 'when');
      if(content) this.eventCreate.when = content.text;
      content = contents.find(e=>e.key == 'quota');
      if(content) this.eventCreate.quota = content.text;
      content = contents.find(e=>e.key == 'currency');
      if(content) this.eventCreate.currency = content.text;
      content = contents.find(e=>e.key == 'priceDefault');
      if(content) this.eventCreate.priceDefault = Number.parseFloat(content.text);

      this.eventCreate.titles = contents.filter(e=>e.key.includes('title')).map(e=>e.text);
      this.eventCreate.locations = contents.filter(e=>e.key.includes('location')).map(e=>e.text);
    });
  }
  init(){
    this.event = new Event;
  }
  async create(){
    const jwt = localStorage.getItem("jwt");
    if(jwt){
      var user = this.getUsername();
      this.divagandoApiService.post<Event>(`events?user=${user}`, this.newEvent, (event) => {
        this.event = event;
        this.newEvent = new Event;
      });
    }else{
      await this.authService.signInWithGoogle();
      await this.create();
    }
  }
  getEventType(){
    if(this.newEvent.title){
      return window.location.origin.includes('tunel') ? EventType.Career : EventType.Party;
    }
    return undefined;
  }
  protectionLabel(){
    return this.newEvent.public ? 'Público' : 'Privado';
  }
  update(bora?: boolean){
    var user = this.getUsername();
    this.newEvent.eventType = this.getEventType();
    this.divagandoApiService.patch<Event>(`events/${this.event!.id}?user=${user}`, this.newEvent, (event) => {
      this.event = event;
      this.newEvent = new Event();
      if(!event.location){
        this.getCurrentPlace();
      }
      if(bora){
        this.toastr.success('Bora então!');
        this.close();
      }
    });
  }
  addressChange(){
    this.newEvent.location = this.googlePlace?.nativeElement.value;
  }
  quote(){
    var user = this.activeRoute.snapshot.params['user'];
    let attendeeReply = new AttendeeReply();
    attendeeReply.comment = this.newEvent.price ? `R$${this.newEvent.price}` : 'Não sei quanto vale.';
    this.divagandoApiService.patch(`events/${this.event!.id}/reply?user=${user}`, attendeeReply,  (event: Event) => {
      this.event!.price = this.newEvent.price || this.eventCreate.priceDefault;
    }, async (errorResponse: HttpErrorResponse)=>{
    });
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

  inProgress(){
    return this.event;
  }
  close(){
    this.event = undefined;
  }
}
