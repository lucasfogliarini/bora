import { Component, ViewChild } from '@angular/core';
import { Account } from '../models/account.model';
import { Event } from '../models/event.model';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { BoraApiService } from '../bora-api.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication.service';
import { EventCreateComponent } from '../event-create/event-create.component';
import { EventsComponent } from '../events/events.component';
import { EventCommentComponent } from '../event-comment/event-comment.component';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  env = environment;
  account = new Account;
  editing: boolean = false;
  pastObserversMessage?: string;
  futureObserversMessage?: string;

  eventCreate!: EventCreateComponent;
  @ViewChild(EventCreateComponent)
  set eventCreateChield(eventCreate: EventCreateComponent) {
    if(eventCreate != undefined){
      this.eventCreate = eventCreate;
      this.eventCreate.eventUpdated.subscribe((event: Event)=>{
        if(event.public)
          this.refreshEvents();
      });
      this.eventCreate.account = this.account;
      const callsOpen = this.activeRoute.snapshot.queryParams['callsOpen'] != undefined;
      if(this.account.partnerCallsOpen || callsOpen)
        this.initEvent();
    }
  }
  eventComment!: EventCommentComponent;
  @ViewChild(EventCommentComponent)
  set eventCommentChield(eventComment: EventCommentComponent) {
    if(eventComment != undefined)
      this.eventComment = eventComment;
  }

  events!: EventsComponent;
  @ViewChild(EventsComponent)
  set eventsChield(events: EventsComponent) {
    if(events != undefined)
      this.events = events;
  }

  constructor(private boraApiService: BoraApiService,
              public authService: AuthenticationService,
              private toastr: ToastrService,
              private router: Router,
              private title: Title,
              private activeRoute: ActivatedRoute) {
                let user = this.getUser();
                this.boraApiService.getAccount(user, (account: Account)=>{
                  this.account = account;
                  this.title.setTitle(`${account.name} no ${this.env.appName}`);
                  this.setObservers();
                });

                this.router.events.subscribe(e=>{
                  if(e instanceof ActivationEnd){
                    this.editing = e.snapshot.queryParams['editing'] === 'true';
                  }
                });
  }
  initEvent(){
    this.eventCreate.init();
  }
  initComment(){
    this.eventComment.init();
  }
  changePartnership(){
    this.boraApiService.patch<Account>(`accounts`, this.account, () => {
      this.toastr.success('Perfil atualizado.');
   });
  }
  whyRevokeCalendar(){
    var whatsAppApi = `https://api.whatsapp.com/send?phone=${environment.adminPhone}&text=Olá, estou revogando meu acesso ao Google Agenda por que ...`;
    var aHref = `<a href='${whatsAppApi}' target='_blank'>Por que está revogando acesso a sua agenda?</a>`;
    return aHref;
  }
  unauthorizeCalendar(){
    this.authService.unauthorizeCalendar();
  }
  inProgress(){
      return this.eventCreate ? this.eventCreate.inProgress() : false;
  }
  refreshEvents(){
    this.events.refreshEvents();
  }
  setObservers(){
    if(this.account.calendarAuthorized){
      let user = this.getUser();
      const today = new Date();
      let daysAgo = new Date();
      daysAgo.setDate(today.getDate() - 14);
      today.setDate(today.getDate() + 14);
      const eventsDaysAgoUri = `events?user=${user}&timeMin=${daysAgo.toISOString()}&timeMax=${today.toISOString()}`;
      this.boraApiService.get(eventsDaysAgoUri, (events: Event[]) => {
          if(events){
            const pastObservers = [...new Map(events.filter(e=>new Date(e.start) <= new Date()).flatMap(e=>e.attendees).map(e => [e['username'], e])).values()];
            this.pastObserversMessage = pastObservers.filter(e=>e.username != user).map(e=>`<img src='${e.photo}' />&nbsp;<a href='${window.location.origin}/${e.username}'>${e.name}</a>&nbsp;<small>${e.isPartner ? this.env.mainRole : ''}</small><br />`).join('');

            const futureObservers = [...new Map(events.filter(e=>new Date(e.start) > new Date()).flatMap(e=>e.attendees).map(e => [e['username'], e])).values()];
            this.futureObserversMessage = futureObservers.filter(e=>e.username != user).map(e=>`<img src='${e.photo}' />&nbsp;<a href='${window.location.origin}/${e.username}'>${e.name}</a>&nbsp;<small>${e.isPartner ? this.env.mainRole : ''}</small><br />`).join('');
          }
      });
    }
  }
  getUser(){
    return this.activeRoute.snapshot.params['user'] || 'lucasfogliarini';
  }
  updateAccount(){
    this.boraApiService.patch<Account>(`accounts`, this.account, () => {       
       this.editing = false;
       this.toastr.success('Perfil atualizado.');
       this.router.navigate([this.account.username]);
    });
  }
  openGoogleConta(){
    window.open('https://myaccount.google.com/personal-info', '', 'popup');
  }
}
