import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication.service';
import { DivagandoApiService } from '../divagando-api.service';
import { AttendeeOrder } from '../models/attendee-order.model';
import { AttendeeReply } from '../models/attendee-reply.model';
import { Content } from '../models/content.model';
import { EventOrder } from '../models/event-order.model';
import { Event } from '../models/event.model';

@Component({
  selector: 'app-event-order',
  templateUrl: './event-order.component.html',
  styleUrls: ['./event-order.component.css']
})
export class EventOrderComponent {
  eventOrder: EventOrder = new EventOrder;
  attendeeOrder?: AttendeeOrder;
  attendeeOrderCreating: AttendeeOrder = new AttendeeOrder;

  constructor(private divagandoApiService: DivagandoApiService,
              private authService: AuthenticationService,
              private toastr: ToastrService,
              private activeRoute: ActivatedRoute) {
                this.setContents();
  }
  update(){
    this.attendeeOrder!.type = this.attendeeOrderCreating.type;
    this.attendeeOrder!.price = this.attendeeOrderCreating.price;
    this.attendeeOrder!.product = this.attendeeOrderCreating.product;
  }
  setContents(){
    this.divagandoApiService.getContents('event-order', (contents: Content[])=>{
      let content = contents.find(e=>e.key == 'what');
      if(content) this.eventOrder.what = content.text;
    });
  }
  create(){
    const jwt = localStorage.getItem("jwt");
    if(jwt){
        this.attendeeOrder = new AttendeeOrder;
    }else{
      this.authService.signInWithGoogle();
    }
  }
  sendOrder(){
    var user = this.activeRoute.snapshot.params['user'];
    let attendeeReply = new AttendeeReply();
    attendeeReply.comment = this.attendeeOrder?.getComment();
    this.divagandoApiService.patch(`events/${this.attendeeOrder?.eventId}/reply?user=${user}`, attendeeReply,  (event: Event) => {
      this.toastr.success('Pedido enviado!');
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
