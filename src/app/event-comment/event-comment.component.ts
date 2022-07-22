import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication.service';
import { DivagandoApiService } from '../divagando-api.service';
import { AttendeeReply } from '../models/attendee-reply.model';
import { Content } from '../models/content.model';
import { EventComment } from '../models/event-comment.model';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-event-comment',
  templateUrl: './event-comment.component.html',
  styleUrls: ['./event-comment.component.css']
})
export class EventCommentComponent {
  eventcomment: EventComment = new EventComment;
  attendeeComment?: AttendeeReply;
  attendeeCommentCreating: AttendeeComment = new AttendeeComment;
  //events?: Event[] = [];
  nextEvent?: Event;

  constructor(private divagandoApiService: DivagandoApiService,
              private authService: AuthenticationService,
              private toastr: ToastrService,
              private activeRoute: ActivatedRoute) {
  }
  getUser(){
    return this.activeRoute.snapshot.params['user'] || 'lucasfogliarini';
  }
  setEvents(){
    let user = this.getUser();
    const timeMax = '2022-07-26';
    var eventsUri = `events?user=${user}&timeMax=${timeMax}`;
    this.divagandoApiService.get<Event[]>(eventsUri, (events: Event[]) => {
      if(events?.length)
        this.nextEvent = events[0];
    }, (errorResponse: HttpErrorResponse)=>{
    });
  }
  update(){
    this.attendeeComment!.type = this.attendeeCommentCreating.type;
    this.attendeeComment!.price = this.attendeeCommentCreating.price;
    this.attendeeComment!.product = this.attendeeCommentCreating.product;
  }
  setContents(){
    this.divagandoApiService.getContentsByDomain('event-comment', (contents: Content[])=>{
      let content = contents.find(e=>e.key == 'what');
      if(content) this.eventcomment.what = content.text;

      this.eventcomment.questions = contents.filter(e=>e.key.includes('question')).map(e=>e.text);
    });
  }
  create(){
    const jwt = localStorage.getItem("jwt");
    if(jwt){
        this.attendeeOrder = new AttendeeOrder;
        this.setEvents();
        this.setContents();
    }else{
      this.authService.signInWithGoogle();
    }
  }
  sendOrder(eventId: string){
    var user = this.activeRoute.snapshot.params['user'];
    let attendeeReply = new AttendeeReply();
    attendeeReply.comment = this.attendeeOrder?.getComment();
    this.divagandoApiService.patch(`events/${eventId}/reply?user=${user}`, attendeeReply,  (event: Event) => {
      this.toastr.success(this.eventOrder.success);
      this.close();
    }, async (errorResponse: HttpErrorResponse)=>{

    });
  }
  inProgress(){
    return this.attendeeOrder;
  }
  close(){
    this.attendeeOrder = undefined;
    this.attendeeOrderCreating = new AttendeeOrder;
  }
}
