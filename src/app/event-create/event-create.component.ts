import { Component } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
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

  constructor(private divagandoApiService: DivagandoApiService,
              private authService: SocialAuthService,
              private toastr: ToastrService,
              private events: EventsComponent) {
  }
  create(){
    this.newEvent = new Event();
    this.divagandoApiService.post<Event>('events', this.newEvent, (event) => {
      this.event.id = event.id;
      this.event.attendeeEmails = event.attendeeEmails;
      this.newEvent = new Event();
      this.toastr.success('Fecho.');
    }, (errorResponse)=>{
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    });
  }
  update(pub: boolean = false){
    this.newEvent.public = pub;
    this.divagandoApiService.patch<Event>('events/'+this.event.id, this.newEvent, (event) => {
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
