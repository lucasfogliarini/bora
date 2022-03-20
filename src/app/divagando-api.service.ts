import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class DivagandoApiService {
  constructor(private http: HttpClient, 
    @Inject('DIVAGANDO_API') private baseUrl: string,
    private toastr: ToastrService) { }

  get<T>(resource: string, subscribe: (value: T) => void){
    var uri = `${this.baseUrl}${resource}`;
    this.http.get<T>(uri).subscribe(subscribe, (response)=> this.requestError(response));
  }

  getText(resource: string, subscribe: (value: string) => void){
    var uri = `${this.baseUrl}${resource}`;
    this.http.get(uri, { responseType: 'text'}).subscribe(subscribe, (response) => this.requestError(response));
  }

  post<T>(resource: string, body: any, subscribe: (value: T) => void){
    var uri = `${this.baseUrl}${resource}`;
    this.http.post<T>(uri, body).subscribe(subscribe, (response)=> this.requestError(response));
  }

  put<T>(resource: string, body: any, subscribe: (value: T) => void){
    var uri = `${this.baseUrl}${resource}`;
    this.http.put<T>(uri, body).subscribe(subscribe, (response)=> this.requestError(response));
  }

  patch<T>(resource: string, body: any, subscribe: (value: T) => void){
    var uri = `${this.baseUrl}${resource}`;
    this.http.patch<T>(uri, body).subscribe(subscribe, (response)=> this.requestError(response));
  }

  put_(resource: string){
    var uri = `${this.baseUrl}${resource}`;
    this.http.put(uri, null).subscribe(()=> true,(response)=> this.requestError(response));
  }

  delete(resource: string,  subscribe: (value: any) => void){
    var uri = `${this.baseUrl}${resource}`;
    this.http.delete(uri).subscribe(subscribe, (response)=> this.requestError(response));
  }

  requestError(errorResponse){
    var messageTitle = "";
    if(errorResponse.statusText) messageTitle = errorResponse.statusText;
    if(errorResponse.error) messageTitle = errorResponse.error.title;
    this.toastr.error(messageTitle);
  }
}
