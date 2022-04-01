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
  templateUrl: './event-create.component.html'
})
export class EventCreateComponent {
  event: Event = new Event;
  newEvent: Event = new Event;
  placesOptions: Options = new Options;

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
      this.toastr.success('Fecho.');
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
      var credit = 0;
      if(this.event.location){
        credit += 5;
      }
      if(this.event.title){
        credit += 5;
      }
      if(this.event.public){
        credit += 5;
      }

      if(credit == 0){
        this.toastr.success('Bora então!');
      }else{
        this.toastr.success(`R$${credit} pila se tu for!`);
      }
      
      if(pub){
        this.events.getEvents();
        this.event = new Event;
      }
    });
  }
  addressChange(address: Address){
    this.newEvent.location = address.formatted_address;
  }
}
