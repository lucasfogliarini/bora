import { Component } from '@angular/core';
import { Event } from '../models/event.model';
import { ToastrService } from 'ngx-toastr';
import { DivagandoApiService } from '../divagando-api.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Account } from '../models/account.model';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html'
})
export class EventsComponent {
  account = new Account;
  events: Event[] = [];
  event: Event = new Event;
  newEvent: Event = new Event;

  constructor(private divagandoApiService: DivagandoApiService,
              private authService: SocialAuthService,
              private toastr: ToastrService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private meta: Meta,
              private title: Title) {
              this.getEvents();
  }
  getEvents(){
    let user = this.activeRoute.snapshot.params['user'];
    this.divagandoApiService.getAccount(user, (account: Account)=>{
      this.account = account;
    });

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
  participate(eventId: string){
    var user = this.activeRoute.snapshot.params['user'];
    this.divagandoApiService.patch_(`events/${eventId}/participate?user=${user}`, (event) => {
      this.toastr.success('Então bora!');
    }, (errorResponse)=>{
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    });
  }
  addressChange(address: Address){
    this.newEvent.location = address.formatted_address;
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
    var user = this.activeRoute.snapshot.params['user'];
    let eventUrl = `${environment.divagando}${user}?eId=${this.shortId(event)}`;
    var whatsappText = window.encodeURIComponent(`${event.title} \n\n Data: ${date} \n ${eventUrl}`);
    var whatsAppLink = `https://api.whatsapp.com/send/?text=${whatsappText}`;
    window.open(whatsAppLink);
  }
  isSelectedEvent(event: Event){
    var date = new Date(event.start).toLocaleDateString();
    var isEvent = this.activeRoute.snapshot.queryParams['eId'] == this.shortId(event);
    if(isEvent){
      this.title.setTitle(`${event.title} - ${date}`);
      this.meta.updateTag({ name: 'og:title', content: `Bora ${event.title} - ${date}` });
      this.meta.updateTag({ name: 'description', content: event.location?.substring(0,50)! });
      this.meta.updateTag({ name: 'og:image', content: this.account.photo! });
      return 'selectedEvent';
    }
    return '';
  }
  shortId(event: Event){
     return event.id?.substring(0,5);
  }
  selectEvent(event: Event){
    this.router.navigate([], { queryParams: { eId: this.shortId(event) } });
  }
  attendees(attendees: string[]){
    return attendees?.map(e=>`<a href="${environment.divagando}${e}">${e}</a><br>`).join('');
  }
}
