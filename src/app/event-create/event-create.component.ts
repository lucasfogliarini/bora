import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication.service';
import { BoraApiService } from '../bora-api.service';
import { Account } from '../models/account.model';
import { AttendeeReply } from '../models/attendee-reply.model';
import { Content } from '../models/content.model';
import { EventCreate } from '../models/event-create.model';
import { Event } from '../models/event.model';
import { Scenario } from '../models/scenario.model';
import { Location } from '../models/location.model';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent {
  event?: Event;
  newEvent: Event = new Event;
  account?: Account;
  placesOptions: Options = new Options;
  eventCreate: EventCreate = new EventCreate;
  scenarios?: Scenario[];
  @Output() eventUpdated: EventEmitter<any> = new EventEmitter();

  @ViewChild('googlePlace')
  googlePlace?: ElementRef;

  constructor(private boraApiService: BoraApiService,
              private authService: AuthenticationService,
              private toastr: ToastrService,
              private activeRoute: ActivatedRoute) {
                this.placesOptions.componentRestrictions = { country: 'br' };
                this.setContents();
                this.setScenarios();
                this.setLocations();
  }
  getUsername(){
    return this.activeRoute.snapshot.params['user'] || 'lucasfogliarini';
  }
  setLocations(){
    this.boraApiService.getLocations(this.getUsername(), (locations: Location[])=>{
      this.eventCreate.locations = [...new Set(locations.filter(s=>s).map(s=>s.name!))];
    });
  }
  setScenarios(){
    this.boraApiService.getEnabledScenarios(this.getUsername(), (scenarios: Scenario[])=>{
      this.scenarios = scenarios;
      if(scenarios.length){
        this.eventCreate.titles = scenarios.map(s=>s.title);
      }
    });
  }
  setContents(){
    this.boraApiService.getContents('event-create', this.getUsername(), (contents: Content[])=>{
      let content = contents.find(e=>e.key == 'what');
      if(content) this.eventCreate.what = content.text;
      content = contents.find(e=>e.key == 'titleSuggestion');
      if(content) this.eventCreate.titleSuggestion = content.text;
      content = contents.find(e=>e.key == 'where');
      if(content) this.eventCreate.where = content.text;
      content = contents.find(e=>e.key == 'when');
      if(content) this.eventCreate.when = content.text;
      content = contents.find(e=>e.key == 'evaluation');
      if(content) this.eventCreate.evaluation = content.text;
      content = contents.find(e=>e.key == 'evaluationMax');
      if(content) this.eventCreate.evaluationMax = Number.parseInt(content.text);
      content = contents.find(e=>e.key == 'currency');
      if(content) this.eventCreate.currency = content.text;
    });
  }
  init(){
    this.event = new Event;
  }
  create(){
    const jwt = localStorage.getItem("jwt");
    if(jwt){
      var user = this.getUsername();
      this.setScenario();
      this.boraApiService.post<Event>(`events?user=${user}`, this.newEvent, (event) => {
        this.event = event;
        this.newEvent = event;
        this.eventUpdated.emit(event);
      });
    }else{
      this.authService.signInWithGoogle((dialog: MatDialog)=>{
        dialog.closeAll();
        this.create()
      });
    }
  }
  protectionLabel(){
    return this.newEvent.public ? 'Público' : 'Privado';
  }
  update(bora?: boolean){
    var user = this.getUsername();
    this.boraApiService.patchEvent(user,this.event!.id, this.newEvent, (event: Event) => {
      this.event = event;
      if(!event.location){
        this.getCurrentPlace();
      }
      if(bora){
        this.close();
        if(this.newEvent.public)
          this.toastr.success(`${this.eventCreate.success} Compartilha no Whatsapp 👇`);
        else
          this.toastr.success(`${this.eventCreate.success}`);
      }
      this.eventUpdated.emit(event);
      this.newEvent = event;
    });
  }
  addressChange(){
    this.newEvent.location = this.googlePlace?.nativeElement.value;
  }
  evaluate(){
    var user = this.activeRoute.snapshot.params['user'];
    let attendeeReply = new AttendeeReply();
    attendeeReply.comment = this.newEvent.evaluation ? `${this.eventCreate.currency}${this.newEvent.evaluation}` : '';
    this.boraApiService.patch(`events/${this.event!.id}/reply?user=${user}`, attendeeReply,  (event: Event) => {
      this.event!.evaluation = this.newEvent.evaluation || this.eventCreate.evaluationDefault;
    }, async (errorResponse: HttpErrorResponse)=>{
    });
  }
  getCurrentPlace(){
    window.navigator.geolocation.getCurrentPosition(position =>{
      //@ts-ignore
      var geocoder = new google.maps.Geocoder();
      //@ts-ignore
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      //@ts-ignore
      geocoder.geocode({'location': latLng }, addresses =>{
        this.newEvent.location = addresses[0].formatted_address;
      });
    }, error =>{
      //error.code 1 You've decided not to share your position, but it's OK. We won't ask you again.
      //error.code 2 The network is down or the positioning service can't be reached.
      //error.code 3 The attempt timed out before it could get the location data.
      //else Geolocation failed due to unknown error.;
    });
  }

  inProgress(){
    return this.event;
  }
  back(){
    if(this.event?.evaluation)
      this.event!.evaluation = undefined;
    else if(this.event?.location)
      this.event!.location = undefined;
    else if(this.event?.title)
      this.event!.title = undefined;//está criando 2 eventos.
  }
  close(){
    this.event = undefined;
  }
  setScenario(){
    const scenario = this.scenarios!.find(e=>e.title == this.newEvent.title);
    if(scenario?.location){
      this.newEvent.location = scenario.location;
    }
    if(scenario?.description){
      this.newEvent.description = scenario.description;
    }
    var futureDate = new Date();
    if(scenario?.startsInDays){
      futureDate.setDate(futureDate.getDate() + scenario!.startsInDays);
      futureDate.setHours(18);
    }else{
      futureDate.setHours(futureDate.getHours() + 1);
    }
    this.newEvent.start = futureDate;
    if(scenario?.public){
      this.newEvent.public = scenario.public;
    }
  }
}
