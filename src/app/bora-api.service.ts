import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account } from './models/account.model';
import { Content } from './models/contents/content.model';
import { Scenario } from './models/scenario.model';
import { Event } from './models/event.model';
import { Location } from './models/location.model';
import { AccountInput } from './models/account-input.model';
import { Responsibility } from './models/responsibility.model';

@Injectable({
  providedIn: 'root'
})
export class BoraApiService {
  baseUrl: string = environment.boraApi;
  constructor(private http: HttpClient,
    private toastr: ToastrService) {}

  getPartners(calendarAuthorized: boolean, partnerActivityDays: number, callBack: (partners: Account[]) => void){
    const lastDays = this.todayAddDays(partnerActivityDays);
    const calendarAuthorizedFilter = calendarAuthorized ? 'and CalendarAuthorized eq true' : '';
    let partnersUri = `accounts?filter= IsPartner eq true ${calendarAuthorizedFilter} and UpdatedAt ge ${lastDays.toISOString()}&orderby=CalendarAuthorized desc, UpdatedAt desc, PartnerSince asc`;

    this.get(partnersUri, (partners: Account[])=>{
        callBack(partners);
    });
  }
  getResponsibilities(callBack: (callback: Responsibility[]) => void){
    let resposibilitiesUri = `responsibilities?orderby=UpdatedAt desc`;

    this.get(resposibilitiesUri, (responsibilities: Responsibility[])=>{
        callBack(responsibilities);
    });
  }

  todayAddDays(days: number = -1){
    const today = new Date();
    const date = new Date(today.setDate(today.getDay() + days));
    return date;    
  }

  getAccount(username: string, onFound: any){
    var accountUri = `accounts?filter=username eq '${username}'`;
    this.get<Account[]>(accountUri, (accounts) => {
      let account;
      if(accounts.length){
        account = accounts[0];
      }else{
        this.toastr.warning('Usuário não encontrado.');
      }
      onFound(account);
    });
  }

  patchAccount(account: AccountInput, callBack: (account: Account) => void){
    this.patch<Account>(`accounts`, account, callBack);
  }

  getContentsByDomain(collection: string, callBack: (content: Content[]) => void){
    const accountId = window.location.origin.includes('tunel') ? 5 : 1;
    let contentsUri = `contents?filter=collection eq '${collection}' and accountId eq ${accountId}`;

    this.get(contentsUri, (homeContents: Content[])=>{
       callBack(homeContents);
    });
  }

  getContents(collection: string, username: string, callBack: (content: Content[]) => void){
    let contentsUri = `contents?filter=collection eq '${collection}' and Account/Username eq '${username}'`;

    this.get(contentsUri, (homeContents: Content[])=>{
       callBack(homeContents);
    });
  }
  patchEvent(user: string, id: string, event: Event, callBack: (event: Event) => void){
    this.patch<Event>(`events/${id}?user=${user}`, event, callBack);    
  }

  getEnabledScenarios(username: string, callBack: (scenariosCallback: Scenario[]) => void){
    let scenariosUri = `scenarios?filter=Account/Username eq '${username}' and Enabled eq true&orderby=UpdatedAt desc`;

    this.get(scenariosUri, (scenarios: Scenario[])=>{
       callBack(scenarios);
    });
  }

  getEnabledLocations(username: string, callBack: (scenariosCallback: Location[]) => void){
    let locationsUri = `locations?filter=Account/Username eq '${username}'and Enabled eq true&orderby=Enabled desc, UpdatedAt desc`;
    this.get(locationsUri, (locations: Location[])=>{
       callBack(locations);
    });
  }

  getScenarios(username: string, callBack: (scenariosCallback: Scenario[]) => void){
    let scenariosUri = `scenarios?filter=Account/Username eq '${username}'&orderby=Enabled desc, UpdatedAt desc`;

    this.get(scenariosUri, (scenarios: Scenario[])=>{
       callBack(scenarios);
    });
  }

  get<T>(resource: string, next: (value: T) => void, error?: (err: any) => void){
    var uri = `${this.baseUrl}${resource}`;
    var observable = this.http.get<T>(uri);
    this.subscribe(observable, next, error);
  }

  getText(resource: string, next: (value: string) => void, error?: (err: any) => void){
    var uri = `${this.baseUrl}${resource}`;
    var observable = this.http.get(uri, { responseType: 'text'});
    this.subscribe(observable, next, error);
  }

  post<T>(resource: string, body: any, next: (value: T) => void, error?: (err: any) => void){
    var uri = `${this.baseUrl}${resource}`;
    var observable = this.http.post<T>(uri, body);
    this.subscribe(observable, next, error);
  }

  postPromise<T>(resource: string, body: T){
    var uri = `${this.baseUrl}${resource}`;
    return this.http.post<any>(uri, body).toPromise();
  }

  put<T>(resource: string, body: T, next: (value: T) => void, error?: (err: any) => void){
    var uri = `${this.baseUrl}${resource}`;
    var observable = this.http.put<T>(uri, body);
    this.subscribe(observable, next, error);
  }

  patch<TResponse>(resource: string, body: any, next: (value: TResponse) => void, error?: (err: any) => void){
    var uri = `${this.baseUrl}${resource}`;
    var observable = this.http.patch<TResponse>(uri, body);
    this.subscribe(observable, next, error);
  }

  patch_(resource: string, next: (value: any) => void, error?: (err: any) => void){
    var uri = `${this.baseUrl}${resource}`;
    var observable = this.http.patch(uri, null);
    this.subscribe(observable, next, error);
  }

  delete(resource: string,  next: (value: any) => void, error?: (err: any) => void){
    var uri = `${this.baseUrl}${resource}`;
    var observable = this.http.delete(uri);
    this.subscribe(observable, next, error);
  }

  subscribe<T>(observable: Observable<T>, next: ((value: T) => void), error?: (err: any) => void){      
      let defaultError = (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.detail);
      };
      observable.subscribe({ 
        next: next,
        error: error || defaultError
      });
  }
}
