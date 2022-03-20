import { Component } from '@angular/core';
import { Event } from '../models/event.model';
import { ToastrService } from 'ngx-toastr';
import { DivagandoApiService } from '../divagando-api.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html'
})
export class EventsComponent {
  events: Event[] = [];
  event: Event = new Event;
  newEvent: Event = new Event;

  constructor(private divagandoApiService: DivagandoApiService,
              private toastr: ToastrService) {
              this.getEvents();
  }
  getEvents(){
    var eventsUri = `events`;
    this.divagandoApiService.get<Event[]>(eventsUri, (events) => {
      this.events = events;
    });
  }
  create(){
    var logged = "divagandonosul@gmail.com";
    this.newEvent = new Event();
    this.newEvent.attendeeEmails = [logged];
    this.divagandoApiService.post<Event>('events', this.newEvent, (event) => {
      this.event.id = event.id;
      this.event.attendeeEmails = event.attendeeEmails;
      this.newEvent = new Event();
      this.toastr.success('Fecho.');
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
        this.getEvents();
        this.event = new Event;
      }
    });
  }
  addressChange(address: Address){
    this.newEvent.location = address.formatted_address;
  }
}
