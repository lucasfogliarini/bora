import { Component } from '@angular/core';
import { Event } from '../models/event.model';
import { ToastrService } from 'ngx-toastr';
import { DivagandoApiService } from '../divagando-api.service';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DomSanitizer, Title } from '@angular/platform-browser';

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
        var eIndex = events.indexOf(currentEvent);
        this.events.splice(eIndex, 1);//remove
        this.events.splice(0, 0, currentEvent);//insert
      }
    }, (errorResponse)=>{
        //usuário não existe ou Calendário não autorizado
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
  openMaps(place?: string){
      var mapsUrl = 'https://www.google.com.br/maps/place/' + place;
      window.open(mapsUrl);
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
    var date = new Date(event.start).toLocaleDateString();
    this.title.setTitle(`${event.title} - ${date}`);
    this.router.navigate([], { queryParams: { eId: this.shortId(event) } });
  }
  attendees(attendees: string[]){
    return attendees?.map(e=>`<a href="${environment.divagando}${e}">${e}</a><br>`).join('');
  }
  getSpotifyEmbedUrl(event: Event){
    if(event.spotifyUrl){
      const path = new URL(event.spotifyUrl).pathname;
      const url = `https://open.spotify.com/embed${path}?utm_source=generator&theme=0`;
      return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return '';
  }
  getBackGroundImage(event: Event){
    return event.attachments ? event.attachments[0] : '';
  }
}
