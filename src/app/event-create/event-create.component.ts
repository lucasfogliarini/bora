import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { ToastrService } from 'ngx-toastr';
import { DivagandoApiService } from '../divagando-api.service';
import { EventsComponent } from '../events/events.component';
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
  titleOptions = ['Churrasco','Festa, dançar e tocar','Viajar ou fazer uma trilha', 'Desenvolver um software'];

  constructor(private divagandoApiService: DivagandoApiService,
              private authService: SocialAuthService,
              private toastr: ToastrService,
              private events: EventsComponent,
              private activeRoute: ActivatedRoute) {
                this.placesOptions.componentRestrictions = { country: 'br' };
}
  create(){
    var user = this.activeRoute.snapshot.params['user'];
    this.newEvent = new Event();
    this.newEvent.location = localStorage.getItem('currentPlace') || undefined;
    this.divagandoApiService.post<Event>(`events?user=${user}`, this.newEvent, (event) => {
      this.event.id = event.id;
      this.event.attendeeEmails = event.attendeeEmails;
      this.newEvent = new Event();
      this.newEvent.location = event.location;
    }, (errorResponse)=>{
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    });
  }
  update(pub: boolean = false){
    var user = this.activeRoute.snapshot.params['user'];
    this.newEvent.public = pub;
    this.divagandoApiService.patch<Event>(`events/${this.event.id}?user=${user}`, this.newEvent, (event) => {
      this.event = event;
      this.newEvent = new Event();
      if(this.event.public){
        this.toastr.success('Bora então!');
        this.events.getEvents();
        this.event = new Event;
      }
    });
  }
  addressChange(address: Address){
    this.newEvent.location = address.formatted_address;
  }
}
