import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Account } from '../models/account.model';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { DivagandoApiService } from '../divagando-api.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../authentication.service';
import { EventCreateComponent } from '../event-create/event-create.component';
import { EventOrderComponent } from '../event-order/event-order.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  account = new Account;
  editing: boolean = false;
  eventCreate!: EventCreateComponent;
  @ViewChild(EventCreateComponent)
  set eventCreateChield(eventCreate: EventCreateComponent) {
    if(eventCreate != undefined)
      this.eventCreate = eventCreate;
  }
  eventOrder!: EventOrderComponent;
  @ViewChild(EventOrderComponent)
  set eventOrderChield(eventOrder: EventOrderComponent) {
    if(eventOrder != undefined)
      this.eventOrder = eventOrder;
  }

  constructor(private divagandoApiService: DivagandoApiService,
              public authService: AuthenticationService,
              private toastr: ToastrService,
              private router: Router,
              private activeRoute: ActivatedRoute) {
                let user = this.getUser();
                this.divagandoApiService.getAccount(user, (account: Account)=>{
                  this.account = account;
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
  createOrder(){
    this.eventOrder.create();
  }
  inProgress(){
      return this.eventCreate ? this.eventCreate.inProgress() : false;
  }
  getUser(){
    return this.activeRoute.snapshot.params['user'] || 'lucasfogliarini';
  }
  updateAccount(){
    this.account.whatsApp = this.account.whatsApp ?? '';
    this.divagandoApiService.patch<Account>(`accounts`, this.account, () => {       
       this.editing = false;
       this.toastr.success('Perfil atualizado!');
       this.router.navigate([this.account.username]);
    });
  }
  openGoogleConta(){
    window.open('https://myaccount.google.com/personal-info', '', 'popup');
  }
}
