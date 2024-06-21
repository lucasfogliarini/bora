import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication.service';
import { BoraApiService } from '../bora-api.service';
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
  placesOptions: Options = new Options;
  eventCreate: EventCreate = new EventCreate;
  scenarios?: Scenario[];
  chatState: string = 'closed';
  @Output() eventUpdated: EventEmitter<any> = new EventEmitter();
  whenTimeStart = 10;
  whenTimeEnd = 22;
  whenTimes = Array.from({ length: this.whenTimeEnd - this.whenTimeStart + 1 }, (_, i) => i + this.whenTimeStart);

  @ViewChild('googlePlace')
  googlePlace?: ElementRef;

  constructor(private boraApiService: BoraApiService,
              public authService: AuthenticationService,
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
      this.toastr.warning('Precisa estar logado para criar um encontro.');
    }
  }
  creatingOrNext(){
    return this.chatState == 'creating' ? 'Criando encontro ... ' : 'Criar e escolher o assunto ...';
  }
  protectionLabel(){
    return this.newEvent.public ? 'Público' : 'Privado';
  }
  updateTitle(){
    var user = this.getUsername();
    const eventPatchTitle: Event = { title: this.newEvent.title };
    this.chatState = 'when-date';
    this.boraApiService.patchEvent(user,this.newEvent!.id!, eventPatchTitle, (event: Event) => {
      if(!event.location){
        this.getCurrentPlace();
      }
      this.eventUpdated.emit(event);
    });
  }
  updateWhenDate(when: string){
    var user = this.getUsername();
    this.newEvent.start = this.getWhenDate(when);
    const eventPatchWhen: Event = {
      start: this.newEvent.start,
      public: this.newEvent.public
    };
    
    this.boraApiService.patchEvent(user, this.newEvent!.id!, eventPatchWhen, (event: Event) => {
      if(when == 'agora')
        this.close();
      else
        this.chatState = 'when-time';
      if(this.chatState == 'closed'){
        this.eventCreated(event);
      }
    });
  }
  updateWhenTime(time: number){
    var user = this.getUsername();
    const startWithTime = new Date(this.newEvent.start!);
    startWithTime.setHours(time);
    startWithTime.setMinutes(0);
    startWithTime.setSeconds(0);
    const eventPatchWhen: Event = {
      start: startWithTime,
      public: this.newEvent.public
    };
    
    this.boraApiService.patchEvent(user, this.newEvent!.id!, eventPatchWhen, (event: Event) => {
      this.close();
      this.eventCreated(event);
    });
  }
  eventCreated(event: Event){
    if(event.public)
      this.toastr.success(`${this.eventCreate.success} Compartilha no Whatsapp 👇`);
    else
      this.toastr.success(`${this.eventCreate.success}`);

    this.router.navigate([], { queryParams: { eId: event.id } });
    setTimeout(()=>{
      window.location.reload();
    }, 1000)
    this.eventUpdated.emit(event);
  }
  getWhenDate(when: string) {
    const now = new Date();
    const daysUntilSaturday = (6 - now.getDay() + 7) % 7; // Calcula os dias até o próximo sábado
    switch (when.toLowerCase()) {
        case 'agora':
          return new Date(now.getTime() + 30 * 60 * 1000); // Adiciona 30 minutos
        case 'hoje':
            return this.nowAddDays(0, 19);
        case 'amanha':
          return this.nowAddDays(1, 19);
        case 'sexta':
            const daysUntilFriday = (5 - now.getDay() + 7) % 7; // Calcula os dias até a próxima sexta
            return this.nowAddDays(daysUntilFriday, 19);
        case 'sabado':
            return this.nowAddDays(daysUntilSaturday, 16);
        case 'sabado_mais_7':
            return this.nowAddDays(daysUntilSaturday  + 7, 16);
        default:
            throw new Error('Parâmetro inválido');
    }
  }
  nowAddDays(addDays: number, hour: number){
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + addDays, hour, 0, 0);
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
