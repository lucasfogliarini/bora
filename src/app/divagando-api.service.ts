import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DivagandoApiService {
  constructor(private http: HttpClient, 
    @Inject('DIVAGANDO_API') public baseUrl: string,
    private toastr: ToastrService) { }

  get<T>(resource: string, next: (value: T) => void, error?: (err: any) => void){
    var uri = `${this.baseUrl}${resource}`;
    var observable = this.http.get<T>(uri);
    this.request(observable, next, error);
  }

  getText(resource: string, next: (value: string) => void, error?: (err: any) => void){
    var uri = `${this.baseUrl}${resource}`;
    var observable = this.http.get(uri, { responseType: 'text'});
    this.request(observable, next, error);
  }

  post<T>(resource: string, body: T, next: (value: T) => void, error?: (err: any) => void){
    var uri = `${this.baseUrl}${resource}`;
    var observable = this.http.post<T>(uri, body);
    this.request(observable, next, error);
  }

  put<T>(resource: string, body: T, next: (value: T) => void, error?: (err: any) => void){
    var uri = `${this.baseUrl}${resource}`;
    var observable = this.http.put<T>(uri, body);
    this.request(observable, next, error);
  }

  patch<T>(resource: string, body: T, next: (value: T) => void, error?: (err: any) => void){
    var uri = `${this.baseUrl}${resource}`;
    var observable = this.http.patch<T>(uri, body);
    this.request(observable, next, error);
  }

  patch_(resource: string, next: (value: any) => void, error?: (err: any) => void){
    var uri = `${this.baseUrl}${resource}`;
    var observable = this.http.patch(uri, null);
    this.request(observable, next, error);
  }

  delete(resource: string,  next: (value: any) => void, error?: (err: any) => void){
    var uri = `${this.baseUrl}${resource}`;
    var observable = this.http.delete(uri);
    this.request(observable, next, error);
  }

  request<T>(observable: Observable<T>, next: ((value: T) => void), error?: (err: any) => void){      
      let defaultError = (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.detail);
      };
      observable.subscribe({ 
        next: next,
        error: error || defaultError
      });
  }
}
