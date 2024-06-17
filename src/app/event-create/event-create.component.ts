import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication.service';
import { BoraApiService } from '../bora-api.service';
import { Account } from '../models/account.model';
import { AttendeeReply } from '../models/attendee-reply.model';
import { Content } from '../models/contents/content.model';
import { EventCreate } from '../models/contents/event-create.model';
import { Event } from '../models/event.model';
import { Scenario } from '../models/scenario.model';
import { Location } from '../models/location.model';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent {
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
              private activeRoute: ActivatedRoute,
              private router: Router) {
                this.placesOptions.componentRestrictions = { country: 'br' };
                this.setContents();
                this.setScenarios();
                this.setLocations();
  }
  getUsername(){
    return this.activeRoute.snapshot.url[0].path || 'bora.work';
  }
  setLocations(){
    this.boraApiService.getEnabledLocations(this.getUsername(), (locations: Location[])=>{
      this.eventCreate.locations = locations;
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
    this.chatState = 'where';
    this.newEvent = new Event;
  }
  chatState: string = 'closed';
  create(){
    const jwt = localStorage.getItem("jwt");
    if(jwt){
      var user = this.getUsername();
      this.chatState = 'creating';
      this.boraApiService.post<Event>(`events?user=${user}`, this.newEvent, (event) => {
        this.newEvent = event;
        this.chatState = 'what';
        this.eventUpdated.emit(event);
      });
    }else{
      this.authService.signInWithGoogle();
    }
  }
  creatingOrNext(){
    return this.chatState == 'creating' ? 'Criando encontro ... ' : 'Próximo';
  }
  protectionLabel(){
    return this.newEvent.public ? 'Público' : 'Privado';
  }
  updateTitle(){
    var user = this.getUsername();
    const eventPatchTitle: Event = { title: this.newEvent.title };
    this.chatState = 'when';
    this.boraApiService.patchEvent(user,this.newEvent!.id!, eventPatchTitle, (event: Event) => {
      if(!event.location){
        this.getCurrentPlace();
      }
      this.eventUpdated.emit(event);
    });
  }
  updateWhen(when: string){
    var user = this.getUsername();
    const eventPatchWhen: Event = {
      start: this.getWhenDateTime(when),
      public: this.newEvent.public
    };    
    this.boraApiService.patchEvent(user, this.newEvent!.id!, eventPatchWhen, (event: Event) => {
      this.close();
      if(event.public)
        this.toastr.success(`${this.eventCreate.success} Compartilha no Whatsapp 👇`);
      else
        this.toastr.success(`${this.eventCreate.success}`);      
      this.router.navigate([], { queryParams: { eId: event.id } });
      setTimeout(()=>{
        window.location.reload();
      }, 1000)
      this.eventUpdated.emit(event);
    });
  }
  getWhenDateTime(when: string) {
    const now = new Date();
    switch (when.toLowerCase()) {
        case 'agora':
            return new Date(now.getTime() + 30 * 60 * 1000); // Adiciona 30 minutos
        case 'hoje':
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0, 0); // Hoje às 16:00
        case 'amanha':
            return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 16, 0, 0); // Amanhã às 16:00
        case 'sexta':
            const daysUntilFriday = (5 - now.getDay() + 7) % 7; // Calcula os dias até a próxima sexta
            return new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilFriday, 19, 0, 0); // Próximo sexta às 19:00
        case 'sabado':
            const daysUntilSaturday = (6 - now.getDay() + 7) % 7; // Calcula os dias até o próximo sábado
            return new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSaturday, 16, 0, 0); // Próximo sábado às 16:00
        case '30_dias':
            const randomDays = Math.floor(Math.random() * 30) + 1;
            return new Date(now.getFullYear(), now.getMonth(), now.getDate() + randomDays, 16, 0, 0); // Data aleatória dentro dos próximos 30 dias às 16:00
        default:
            throw new Error('Parâmetro inválido');
    }
  }  
  addressChange(){
    this.newEvent.location = this.googlePlace?.nativeElement.value;
  }
  getCurrentPlace(){
    /*window.navigator.geolocation.getCurrentPosition(position =>{
      //@ts-ignore
      var geocoder = new google.maps.Geocoder();
      //@ts-ignore
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      //@ts-ignore
      geocoder.geocode({'location': latLng }, addresses =>{
        this.newEvent.location = addresses[0]formatted_address;
      });
    }, error =>{
      //error.code 1 You've decided not to share your position, but it's OK. We won't ask you again.
      //error.code 2 The network is down or the positioning service can't be reached.
      //error.code 3 The attempt timed out before it could get the location data.
      //else Geolocation failed due to unknown error.;
    });*/
  }
  back(){
    if(this.chatState == 'what')
      this.chatState = 'where';
    else if(this.chatState == 'when')
      this.chatState = 'what';
  }
  close(){
    this.newEvent = new Event;
    this.chatState = 'closed';
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
