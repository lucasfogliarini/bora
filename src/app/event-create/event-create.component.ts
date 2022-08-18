import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication.service';
import { DivagandoApiService } from '../divagando-api.service';
import { Account, EventVisibility } from '../models/account.model';
import { AttendeeReply } from '../models/attendee-reply.model';
import { Content } from '../models/content.model';
import { EventCreate } from '../models/event-create.model';
import { Event } from '../models/event.model';
import { Scenario } from '../models/scenario.model';

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
  @Output() eventUpdated: EventEmitter<any> = new EventEmitter();

  @ViewChild('googlePlace')
  googlePlace?: ElementRef;

  constructor(private divagandoApiService: DivagandoApiService,
              private authService: AuthenticationService,
              private toastr: ToastrService,
              private activeRoute: ActivatedRoute) {
                this.placesOptions.componentRestrictions = { country: 'br' };
                this.setContents();
                this.setScenarios();
  }
  getUsername(){
    return this.activeRoute.snapshot.params['user'] || 'lucasfogliarini';
  }
  setScenarios(){
    this.divagandoApiService.getScenarios(this.getUsername(), (scenarios: Scenario[])=>{
      if(scenarios.length){
        this.eventCreate.titles = scenarios.map(s=>s.title);
        this.eventCreate.locations = [...new Set(scenarios.filter(s=>s.location).map(s=>s.location!))];
      }
    });
  }
  setContents(){
    this.divagandoApiService.getContents('event-create', this.getUsername(), (contents: Content[])=>{
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
      this.suiteDiamond();
      this.divagandoApiService.post<Event>(`events?user=${user}`, this.newEvent, (event) => {
        this.event = event;
        this.newEvent = new Event;
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
    this.newEvent.public = this.account?.eventVisibility == EventVisibility.PublicOnly;
    return this.newEvent.public ? 'Público' : 'Privado';
  }
  update(bora?: boolean){
    var user = this.getUsername();
    this.divagandoApiService.patchEvent(user,this.event!.id, this.newEvent, (event: Event) => {
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
      this.newEvent = new Event();
    });
  }
  addressChange(){
    this.newEvent.location = this.googlePlace?.nativeElement.value;
  }
  evaluate(){
    var user = this.activeRoute.snapshot.params['user'];
    let attendeeReply = new AttendeeReply();
    attendeeReply.comment = this.newEvent.evaluation ? `${this.eventCreate.currency}${this.newEvent.evaluation}` : '';
    this.divagandoApiService.patch(`events/${this.event!.id}/reply?user=${user}`, attendeeReply,  (event: Event) => {
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

  suiteDiamond(){
    if(this.newEvent.title?.includes('Suíte Diamond')){
      this.newEvent.description =
      `Quero em uma sexta ou sábado compartilhar com vocês uma pernoite(12h) na <a href='https://www.motelportodoscasais.com.br/suite-diamond'>Suíte Diamond</a>: 
      - <b>Hidro, Piscina, Sauna, Pista com DJ e Bar compartilhados</b>
      - <b>Suíte ao lado da Sala: R$530 (eu e ...)</b>
      - Suíte ao lado da Pista: R$530 (Lucas e Luana)
      - Levarei meu consumo <b>(Água, cerveja, comida)</b>, senão pagarei o preço do bar 
      - Levarei minhas <b>playlists do Tidal</b>, para evitar confusão na hora de tocar.
      -Total: <b>R$530 para mim</b> e R$530 para Lucas e Luana

      Para cada pessoa adicional será cobrado R$90(taxa cobrada pelo Motel).
      Tem dois sofás confortáveis, caso alguém queira ir junto e precise dormir.`;
      this.newEvent.location = 'Motel Porto dos Casais';
    }
  }
}
