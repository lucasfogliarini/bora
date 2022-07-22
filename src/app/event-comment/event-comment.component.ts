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
  eventComment: EventComment = new EventComment;
  attendeeComment?: AttendeeReply;
  commentEvent: Event = new Event;
  attendeeCommentCreating: AttendeeReply = new AttendeeReply;
  events?: Event[];

  constructor(private divagandoApiService: DivagandoApiService,
              private authService: AuthenticationService,
              private toastr: ToastrService,
              private activeRoute: ActivatedRoute) {
  }
  init(){
    const jwt = localStorage.getItem("jwt");
    if(jwt){
        this.attendeeComment = new AttendeeReply;
        this.attendeeCommentCreating = new AttendeeReply;
        this.setEvents();
        this.setContents();
    }else{
      this.authService.signInWithGoogle();
    }
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
        this.events = events;

        console.log(events);
    }, (errorResponse: HttpErrorResponse)=>{
    });
  }
  setContents(){
    this.divagandoApiService.getContentsByDomain('event-comment', (contents: Content[])=>{
      let content = contents.find(e=>e.key == 'what');
      if(content) this.eventComment.what = content.text;

      const questions = contents.filter(e=>e.key.includes('question')).map(e=>e.text);
      if(questions.length)
        this.eventComment.questions = questions;
    });
  }
  update(){
    this.attendeeComment!.comment = this.attendeeCommentCreating.comment;
  }
  comment(eventId: string){
    let user = this.getUser();
    this.divagandoApiService.patch(`events/${eventId}/reply?user=${user}`, this.attendeeComment,  (event: Event) => {
      this.toastr.success(this.eventComment.success);
      this.close();
    }, async (errorResponse: HttpErrorResponse)=>{
    });
  }
  inProgress(){
    return this.attendeeComment;
  }
  close(){
    this.attendeeComment = undefined;
    this.commentEvent = new Event;
    this.attendeeCommentCreating = new AttendeeReply;
  }
}
