import { Component, ViewChild } from '@angular/core';
import { Account } from '../models/account.model';
import { Event } from '../models/event.model';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { DivagandoApiService } from '../divagando-api.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication.service';
import { EventCreateComponent } from '../event-create/event-create.component';
import { EventsComponent } from '../events/events.component';
import { EventCommentComponent } from '../event-comment/event-comment.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  account = new Account;
  editing: boolean = false;
  observersMessage?: string;

  eventCreate!: EventCreateComponent;
  @ViewChild(EventCreateComponent)
  set eventCreateChield(eventCreate: EventCreateComponent) {
    if(eventCreate != undefined)
      this.eventCreate = eventCreate;
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

  constructor(private divagandoApiService: DivagandoApiService,
              public authService: AuthenticationService,
              private toastr: ToastrService,
              private router: Router,
              private activeRoute: ActivatedRoute) {
                let user = this.getUser();
                this.divagandoApiService.getAccount(user, (account: Account)=>{
                  this.account = account;
                  const user = this.getUser();
                  this.getLastObservers();
                });

                this.router.events.subscribe(e=>{
                  if(e instanceof ActivationEnd){
                    this.editing = e.snapshot.queryParams['editing'] === 'true';
                  }
                });
  }
  createEvent(){
    this.eventCreate.init();
  }
  createComment(){
    this.eventComment.init();
  }
  inProgress(){
      return this.eventCreate ? this.eventCreate.inProgress() : false;
  }
  refreshEvents(){
    this.events.getEvents();
    this.events.eventsLoaded = undefined;
  }
  getLastObservers(){
    if(this.account.calendarAuthorized){
      let user = this.getUser();
      const today = new Date();
      let daysAgo = new Date();
      daysAgo.setDate(today.getDate() - 14);
      const eventsDaysAgoUri = `events?user=${user}&timeMin=${daysAgo.toISOString()}&timeMax=${today.toISOString()}`;
      this.divagandoApiService.get(eventsDaysAgoUri, (events: Event[]) => {
          if(events){
            const observers = [...new Map(events.flatMap(e=>e.attendees).map(e => [e['username'], e])).values()];
            this.observersMessage = observers.filter(e=>e.username != user).map(e=>`<img src='${e.photo}' />&nbsp;<a href='${window.location.origin}/${e.username}'>${e.name}</a><br />`).join('');
          }
      });
    }
  }
  getUser(){
    return this.activeRoute.snapshot.params['user'] || 'lucasfogliarini';
  }
  updateAccount(){
    this.account.whatsApp = this.account.whatsApp ?? '';
    this.divagandoApiService.patch<Account>(`accounts`, this.account, () => {       
       this.editing = false;
       this.toastr.success('Perfil atualizado.');
       this.router.navigate([this.account.username]);
    });
  }
  openGoogleConta(){
    window.open('https://myaccount.google.com/personal-info', '', 'popup');
  }
}
