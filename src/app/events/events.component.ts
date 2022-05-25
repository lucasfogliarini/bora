import { Component } from '@angular/core';
import { Event } from '../models/event.model';
import { ToastrService } from 'ngx-toastr';
import { DivagandoApiService } from '../divagando-api.service';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  events: Event[] = [];

  constructor(private divagandoApiService: DivagandoApiService,
              private authService: SocialAuthService,
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
    var eventsUri = `events?user=${user}`;
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
    }, (errorResponse)=>{
        //usuário não existe ou Agenda não autorizada
    });
  }
  participate(eventId: string, attendeeEmail?: string){
    let user = this.getUser();
    let attendeeEmailParam = attendeeEmail ? `&attendeeEmail=${attendeeEmail}` : '';
    this.divagandoApiService.patch_(`events/${eventId}/participate?user=${user}${attendeeEmailParam}`, (event) => {
      this.toastr.success('Então bora!');
    }, (errorResponse)=>{
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(e=>{
        this.participate(eventId, e.email);
      });
    });
  }
  openUrl(url: string){
    window.open(url);
  }
  getLocation(event: Event){
    return event.location ? event.location.substring(0,100) : 'Não informado.';
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
  attendees(attendees: Account[]){
    if(attendees){
      return attendees.map(e=>`<img src='${e.photo}' />&nbsp;<a href='${environment.divagando}${e.username}'>${e.name}</a> <br />`).join('');
    }
    return `<a href="${environment.divagando}${this.getUser()}">${this.getUser()}</a><br>`;
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
