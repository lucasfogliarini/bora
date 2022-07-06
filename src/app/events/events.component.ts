import { Component } from '@angular/core';
import { Event } from '../models/event.model';
import { ToastrService } from 'ngx-toastr';
import { DivagandoApiService } from '../divagando-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { Attendee } from '../models/attendee.model';
import { AuthenticationService } from '../authentication.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  events: Event[] = [];

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
  getEvents(){
    let user = this.getUser();
    var eventsUri = `events?user=${user}&favoritesCount=true`;
    this.divagandoApiService.get<Event[]>(eventsUri, (events: Event[]) => {
      this.events = events;
      var eId = this.activeRoute.snapshot.queryParams['eId'];
      let currentEvent = events.find(e=>e.id.includes(eId));
      if(currentEvent){
        this.selectEvent(currentEvent);
        var eIndex = events.indexOf(currentEvent);
        this.events.splice(eIndex, 1);//remove
        this.events.splice(0, 0, currentEvent);//insert
      }
    }, (errorResponse: HttpErrorResponse)=>{
        this.events = [];
        this.toastr.error(errorResponse.message);
    });
  }
  reply(eventId: string, response: string){
    let user = this.getUser();
    let attendeeReply = {
      response: response
    };
    this.divagandoApiService.patch(`events/${eventId}/reply?user=${user}`, attendeeReply,  (event) => {
      if(response == 'accepted'){
        this.toastr.success('Então bora!');
      }else{
        this.toastr.success('Tranquilo ...');
      }
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
    var date = new Date(event.start).toLocaleDateString();
    let user = this.getUser();
    let eventUrl = `${environment.divagando}${user}?eId=${this.shortId(event)}`;
    var whatsappText = window.encodeURIComponent(`${event.title} - ${date} \n\n ${eventUrl}`);
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
  }
  attendees(attendees: Attendee[]){
    if(attendees){
      return attendees.map(e=>`<img src='${e.photo}' />&nbsp;<a href='${environment.divagando}${e.username}'>${e.name}</a> ${this.proximityRate(e)} <br />`).join('');
    }
    return `<a href="${environment.divagando}${this.getUser()}">${this.getUser()}</a><br>`;
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
}
