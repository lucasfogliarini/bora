import { Component } from '@angular/core';
import { Event } from '../models/event.model';
import { ToastrService } from 'ngx-toastr';
import { DivagandoApiService } from '../divagando-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { Attendee } from '../models/attendee.model';
import { AuthenticationService } from '../authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AttendeeReply } from '../models/attendee-reply.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  events?: Event[] = [];
  eventsLoaded?: Event[];
  eventsMessage?: string = undefined;
  replied: boolean = false;

  constructor(private divagandoApiService: DivagandoApiService,
              private authService: AuthenticationService,
              private toastr: ToastrService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private domSanitizer: DomSanitizer,
              private title: Title) {
              this.getEvents();
  }
  getUser(){
    return this.activeRoute.snapshot.params['user'] || 'lucasfogliarini';
  }
  setEvents(events?: Event[]){
    this.eventsMessage = undefined;
    this.events = events;
    if(events === undefined)
      this.eventsMessage = "Carregando  ...";
    else if(!this.hasEventsLoaded())
      this.eventsMessage = "Sem encontros públicos.";
    else if(events && events.length === 0 && this.hasEventsLoaded())
      this.eventsMessage = "Sem encontros públicos desse tipo ...";
  }
  hasEventsLoaded(){
    return this.eventsLoaded && this.eventsLoaded.length > 0;
  }
  getEvents(){
    let user = this.getUser();
    var eventsUri = `events?user=${user}&favoritesCount=true`;
    this.setEvents(undefined);
    this.divagandoApiService.get<Event[]>(eventsUri, (eventsLoaded: Event[]) => {
      this.eventsLoaded = eventsLoaded;
      this.setEvents(this.eventsLoaded);
      const eId = this.activeRoute.snapshot.queryParams['eId'];
      let currentEvent = eventsLoaded.find(e=>e.id.includes(eId));
      if(currentEvent){
        this.selectEvent(currentEvent);
        var eIndex = eventsLoaded.indexOf(currentEvent);
        this.arrayMove(this.events!, eIndex, 0);
      }else{
        const eType = this.activeRoute.snapshot.queryParams['eType'];
        if(eType){
          let eventsFiltered = this.events!.filter(e=>e.eventType == eType);
          this.setEvents(eventsFiltered);
        }
      }
    }, (errorResponse: HttpErrorResponse)=>{
        this.setEvents([]);
    });
  }
  reply(eventId: string, response: string){
    let user = this.getUser();
    let attendeeReply: AttendeeReply = {
      response: response
    };
    this.divagandoApiService.patch(`events/${eventId}/reply?user=${user}`, attendeeReply,  (event: Event) => {
      if(response == 'accepted'){
        this.toastr.success('Então bora!');
      }else{
        this.toastr.success('Tranquilo ...');
      }
      let oldEventIndex = this.events?.findIndex(e=>e.id == eventId);
      this.events?.splice(oldEventIndex!, 1);
      this.events?.splice(oldEventIndex!, 0, event);
      this.selectEvent(event);
      this.replied = true;
    }, async (errorResponse: HttpErrorResponse)=>{
       if(errorResponse.status == 401){
          await this.authService.signInWithGoogle();
          this.reply(eventId, response);
       }else{
          this.toastr.error(errorResponse.message);
       }
    });
  }
  openUrl(url: string){
    window.open(url);
  }
  getLocation(event: Event){
    return event.location ? event.location.substring(0,100) : 'Não informado.';
  }
  openCalendar(event: Event){
    window.open(event.googleEventUrl);
  }
  openMaps(place?: string){
      if(place){
        var mapsUrl = `https://www.google.com/maps/search/?api=1&query=${place}`;
        window.open(mapsUrl);
      }
  }
  share(event: Event){
    var dateTime = new Date(event.start).toLocaleString('pt-BR');
    let user = this.getUser();
    let eventUrl = `${window.location.origin}/${user}?eId=${this.shortId(event)}`;
    var whatsappText = window.encodeURIComponent(`${event.title} - ${dateTime} \n\n ${eventUrl}`);
    var whatsAppLink = `https://api.whatsapp.com/send/?text=${whatsappText}`;
    window.open(whatsAppLink);
  }
  isSelected(event: Event){
    var isEvent = this.activeRoute.snapshot.queryParams['eId'] == this.shortId(event);
    return isEvent;
  }
  isSelectedClass(event: Event){
    return this.isSelected(event) ? 'selected-event' : '';
  }
  shortId(event: Event){
     return event.id?.substring(0,5);
  }
  selectEvent(event: Event){
    this.expandEvent(event);
    var date = new Date(event.start).toLocaleDateString();
    this.title.setTitle(`${event.title} - ${date}`);
    this.router.navigate([], { queryParams: { eId: this.shortId(event) } });
    let aIndex = event.attendees.findIndex(e=>e.username == this.authService.account.username);
    this.replied = aIndex > 0;
  }
  attendees(event: Event){
    if(event.attendees){
      this.popAttendee(event.attendees);
      let attendeesContent = event.attendees.map(e=>`<img src='${e.photo}' />&nbsp;<a href='${window.location.origin}/${e.username}'>${e.name}</a>&nbsp;<small>${e.isPartner ? 'Parceiro' : ''}</small><br />`).join('');
      if(event.chat)
        attendeesContent += `<div class='row'><small class="col-12"><a href='${event.chat}'>Comente no WhatsApp</a></small></div>`;
      attendeesContent += this.partnerInvite();
      attendeesContent += `<small class="offset-7">${event.attendees.length} convidados</small>`;
      return attendeesContent;
    }
    return `<a href="${window.location.origin}/${this.getUser()}">${this.getUser()}</a><br>`;
  }
  partnerInvite(){
    let message = "Quero ser parceiro do Túnel Criativo!";
    return `<div class='row mt-1'>
                <small class="col-12 font-weight-bold">
                  <a target='_blank' href='https://api.whatsapp.com/send/?phone=5551980451264&text=${message}'>
                  Quero ser parceiro do Túnel Criativo ...
                  </a>
                </small>
            </div>`;
  }
  popAttendee(attendees: Attendee[]){
    let aIndex = attendees.findIndex(e=>e.username == this.authService.account.username);
    if(aIndex > 0){
      this.arrayMove(attendees, aIndex, 0);
    }
  }
  proximityRate(attendee: Attendee){
    var isLoggedUser = this.authService.account.email == this.authService.user?.email;
    return isLoggedUser ? `${attendee.proximityRate}%` : "";
  }
  getSpotifyEmbedUrl(event: Event){
    if(event.spotifyUrl){
      const path = new URL(event.spotifyUrl).pathname;
      const url = `https://open.spotify.com/embed${path}?utm_source=generator&theme=0`;
      return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return '';
  }
  expandEvent(event: Event){
    if(!event.expanded){
      event.expanded = true;
      //@ts-ignore
      const placesService = new google.maps.places.PlacesService(document.createElement('div'));
      placesService.findPlaceFromQuery({ query: event.location, fields: ['photos']}, (response: any) =>{
        if(response && response.length && response[0].photos && response[0].photos.length){
          const bgImage = response[0].photos[0].getUrl();
          document.querySelector(`#e${event.id} .background-image img`)!.setAttribute('src', bgImage);
        }
      });
    }
  }

  arrayMove(arr: Array<any>, fromIndex: number, toIndex: number) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }
}
