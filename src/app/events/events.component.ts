import { Component } from '@angular/core';
import { Event } from '../models/event.model';
import { ToastrService } from 'ngx-toastr';
import { BoraApiService } from '../bora-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { Attendee } from '../models/attendee.model';
import { AuthenticationService } from '../authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AttendeeReply } from '../models/attendee-reply.model';
import { MatDialog } from '@angular/material/dialog';
import { EventCreate } from '../models/contents/event-create.model';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { PlaceResult } from '../models/place-result.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  env = environment;
  eventsQuery?: string;
  events?: Event[] = [];
  eventsLoaded?: Event[];
  eventsMessage?: string = undefined;
  replied: boolean = false;

  constructor(private boraApiService: BoraApiService,
              private authService: AuthenticationService,
              private toastr: ToastrService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private domSanitizer: DomSanitizer,
              private datePipe: DatePipe,
              private title: Title) {
              this.eventsQuery = this.activeRoute.snapshot.queryParams['find'];
              this.getEvents();
  }
  getUser(){
    return this.activeRoute.snapshot.url[0].path || 'bora.work';
  }
  setEvents(events?: Event[]){
    this.eventsMessage = undefined;
    this.events = events;
    if(events === undefined){
      this.eventsMessage = "Carregando ...";
    }
    else if(!this.hasEventsLoaded())
      this.eventsMessage = "Nenhum evento público encontrado. Clique em refresh para recarregar todos os eventos e limpar os filtros.";
  }
  hasEventsLoaded(){
    return this.eventsLoaded && this.eventsLoaded.length > 0;
  }
  getEvents(hasTicket?: boolean){
    let user = this.getUser();
    const query = this.eventsQuery ?? '';
    var eventsUri = `events?user=${user}&query=${query}&hasTicket=${hasTicket ?? false}`;
    this.setEvents(undefined);
    this.boraApiService.get<Event[]>(eventsUri, (eventsLoaded: Event[]) => {
      this.eventsLoaded = eventsLoaded;
      this.setEvents(this.eventsLoaded);
      const eId = this.activeRoute.snapshot.queryParams['eId'];
      let currentEvent = eventsLoaded.find(e=>e.id!.includes(eId));
      if(currentEvent){
        this.selectEvent(currentEvent);
        var eIndex = eventsLoaded.indexOf(currentEvent);
        this.arrayMove(this.events!, eIndex, 0);
      }
    }, (errorResponse: HttpErrorResponse)=>{
        this.setEvents([]);
    });
  }
  privateEvent(event: Event){
    const eventPrivate = new Event();
    eventPrivate.public = false;
    this.boraApiService.patchEvent(this.getUser(), event.id!, eventPrivate, (eventUpdated: Event) => {
      this.toastr.success('Encontro privado com sucesso.');
      this.refreshEvents();
    });
  }
  refreshEvents(){
    this.eventsLoaded = undefined;
    this.eventsQuery = undefined;
    this.getEvents();
  }
  fullDateTime(event: Event){
    return `${this.transformDate(event)} - ${this.transformDateEE(event)} - ${this.transformTime(event.start!)}`;
  }
  isDay(eventTime: Date){
    const eventStart = new Date(eventTime);
    return eventStart.getHours() >= 6 && eventStart.getHours() < 18;
  }
  transformDate(event: Event){
    const eventStart = new Date(event.start!);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if(this.isNow(eventStart))
      return 'Agora';
    else if(eventStart.toDateString() == today.toDateString())
      return 'Hoje';
      else if(eventStart.toDateString() == tomorrow.toDateString())
      return 'Amanhã';
    else
      return this.datePipe.transform(event.start, 'dd/MM/yy');
  }
  isNow(date: Date){
    const now = new Date();
    date.setHours(date.getHours() - 1);
    return date.getFullYear() == now.getFullYear()
           && date.getMonth() == now.getMonth()
           && date.getDate() == now.getDate()
           && date.getTime() < now.getTime();
  }
  transformTime(eventTime: Date){
    const icon = this.isDay(eventTime) ? '🌞': '🌒';
    const dateTime = this.datePipe.transform(eventTime, 'HH:mm');
    return `${icon} ${dateTime}` ;
  }
  transformDateEE(event: Event){
    return this.datePipe.transform(event.start, 'EE', '', 'pt-BR');
  }
  replyBoraApi(event: Event, response: string){
    let user = this.getUser();
    let attendeeReply: AttendeeReply = {
      response: response
    };
    this.boraApiService.patch(`events/${event.id}/reply?user=${user}`, attendeeReply,  (event: Event) => {
      if(response == 'accepted'){
        this.toastr.success('Então bora!');
      }else{
        this.toastr.success('Tranquilo ...');
      }
      let oldEventIndex = this.events?.findIndex(e=>e.id == event.id);
      this.events?.splice(oldEventIndex!, 1);
      this.events?.splice(oldEventIndex!, 0, event);
      this.selectEvent(event);
      this.replied = true;
    }, async (errorResponse: HttpErrorResponse)=>{
       if(errorResponse.status == 401){
          this.authService.signInWithGoogle((dialog: MatDialog)=>{
            dialog.closeAll();
            this.reply(event, response);
          });
       }else{
          this.toastr.error(errorResponse.message);
       }
    });
  }

  reply(event: Event, response: string){
    var useWhatsApp = true;
    if(useWhatsApp){
      var responseText = response == "accepted" ? "Confirmo presença" : "Quero e tentarei ir";
      var dateTime = this.fullDateTime(event);
      let conferenceText = this.isConference(event) ? `
Canal: 
${event.conferenceUrl}` : '';

      let whatsappGroupText = event.chat ? `
WhatsApp (grupo): 
${event.chat}` : '';

      var whatsappText = 
`${responseText} no encontro ...
${event.title}
${dateTime}
${conferenceText}
${whatsappGroupText}
`;
    const whatsAppLink = this.generateWhatsAppLink(whatsappText, environment.adminPhone);
    window.open(whatsAppLink);
    }else{
      this.replyBoraApi(event, response);
    }
  }
  openUrl(url: string){
    window.open(url);
  }
  getLocation(event: Event){
    return event.location ? event.location.substring(0,100) : 'Indefinido.';
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
  openConference(event: Event){
    window.open(event.conferenceUrl);
  }
  getLocationShare(event: Event){
    if(this.conferenceOnLocation(event)){
      return event.location?.includes('discord') ? "💻 Discord" : "💻 Google Meet"
    }
    else if(!event.location){
      return "Indefinido."
    }
    else{
      return `${event.location?.substring(0,30)} ...`;
    }
  }
  share(event: Event){
    var dateTime = this.fullDateTime(event);
    let user = this.getUser();
    let eventUrl = `${window.location.origin}/${user}?eId=${this.shortId(event)}`;
    let ticketUrl = event.ticketUrl ? `
Compra de ingressos:
${event.ticketUrl}` : '';

    var whatsappText = 
`${dateTime}
${event.title}
${this.getLocationShare(event)}

Clique no link e nos dois botões 'Bora!', confirme no WhatsApp 
E ganhe um prêmio misterioso por ter realizado o encontro!
${eventUrl}
${ticketUrl}`;

    const whatsAppLink = this.generateWhatsAppLink(whatsappText);
    window.open(whatsAppLink);
  }
  generateWhatsAppLink(text: string, number?: string){//número nulo será compartilhamento selecionado
    var whatsappText = window.encodeURIComponent(text);
    var whatsAppLink = `https://wa.me/${number || ''}?text=${whatsappText}`;
    return whatsAppLink;
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
    var date = new Date(event.start!).toLocaleDateString();
    this.title.setTitle(`${event.title} - ${date}`);
    this.router.navigate([], { queryParams: { eId: this.shortId(event) } });
    let aIndex = event.attendees?.findIndex(e=>e.username == this.authService.account.username);
    this.replied = aIndex! > 0;
  }
  attendees(event: Event){
    if(event.attendees){
      this.popAttendee(event.attendees);
      let attendeesContent = event.attendees.map(e=>
        `<img src='${e.photo}' /><a href='${window.location.origin}/${e.username}'>${e.name}</a>&nbsp;<small>${e.isPartner ? environment.mainRole : '' }</small><br />${e.comment ? `<small>${e.comment}</small><br />` : '' }`).join('');
      if(event.chat)
        attendeesContent += `<div class='row'><b><a class='col-12 text-center' href='${event.chat}' target='_blank'>Participar do Grupo no WA</a></b></div>`;
      //attendeesContent += this.proposeActivity(event);
      attendeesContent += this.partnerInvite();// Quero ser parceiro
      attendeesContent += `<small class="offset-7">${event.attendees.length} convidados</small>`;
      return attendeesContent;
    }
    return `<a href="${window.location.origin}/${this.getUser()}">${this.getUser()}</a><br>`;
  }
  proposeActivity(event: Event){
    const responseText = 'Quero em outro momento, lugar/canal ou atividade para o encontro ...';
    var dateTime = this.fullDateTime(event);
    const whatsappText = 
`${responseText}
${dateTime}
${event.title}`;
    const whatsAppLink = this.generateWhatsAppLink(whatsappText, environment.adminPhone);
    return `<div class='row'><b><a class='col-12 text-center' href='${whatsAppLink}' target='_blank'>Quero em outro momento, lugar/canal ou atividade ...</a></b></div>`;
  }
  partnerInvite(){
    let message = `Quero ser ${this.env.mainRole} d${this.env.appDefiniteArticle} ${this.env.appName}!`;
    return `<div class='row mt-1'>
                <small class="col-12 font-weight-bold">
                  <a target='_blank' href='https://api.whatsapp.com/send/?phone=${this.env.adminPhone}&text=${message}'>
                  ${message} ...
                  </a>
                </small>
            </div>`;
  }
  ticket(event: Event){
    return `<b>${event.ticketDomain}</b>
                <div class='row mt-1'>
                <p class="col-12 font-weight-bold">
                  ${this.ticketHelpLink(event)}
                </p>
            </div>`;
  }
  ticketHelpLink(event: Event){
    var dateTime = this.fullDateTime(event);
    let helpText = 'Me ajuda a ir com você nesse evento?';

    if(event.discount){
      helpText = `Quero ${event.discount}% de desconto pra ir com você nesse evento!`;
    }
    const whatsappText = `${helpText}
${event.title} 
${dateTime}`;
    const whatsAppLink = this.generateWhatsAppLink(whatsappText, environment.adminPhone);
    return `<a target='_blank' href='${whatsAppLink}'>${helpText}</a>`
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
      let bgImagePath = undefined;
      if(this.conferenceOnLocation(event)){
        if(event.conferenceUrl?.includes('wa.me'))
          bgImagePath = '../../assets/whatsapp.png'
        else if(event.conferenceUrl?.includes('discord'))
          bgImagePath = '../../assets/discord.jpg'
        else
          bgImagePath = '../../assets/google-meet.jpg';  
        this.setBackgroundImage(event, bgImagePath);
      }
      else if(!event.location){
        this.setBackgroundImage(event, '../../assets/bora_bg_place.png')
      }
      else{
        //@ts-ignore
        const placesService = new google.maps.places.PlacesService(document.createElement('div'));
        placesService.findPlaceFromQuery({ query: event.location, fields: ['photos']}, (response: PlaceResult[]) =>{
          var eventBackgroundImage = document.querySelector(`#e${event.id} .background-image`);
          let bgImage = '../../assets/bora_bg_place.png';
          if(response && response.length && response[0].photos && response[0].photos.length){
            const photo = response[0].photos[0].getUrl();
            if(photo)
              bgImage = photo;
          }
          eventBackgroundImage!.setAttribute('src', bgImage);
        });
      }
    }
  }
  setBackgroundImage(event: Event, imgPath: string){
      setTimeout(() => {
        var eventBackgroundImage = document.querySelector(`#e${event.id} .background-image`);
        eventBackgroundImage!.setAttribute('src', imgPath);
      }, 200);
  }
  isConference(event: Event){
    return event.conferenceUrl || this.conferenceOnLocation(event);
  }
  conferenceOnLocation(event: Event){
    return ['discord','meet.google', 'wa.me'].some(c=>event.location?.includes(c)) || ['m','meet',].some(c=>event.location?.startsWith(c));
  }
  arrayMove(arr: Array<any>, fromIndex: number, toIndex: number) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }
}
