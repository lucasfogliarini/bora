import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Account } from "./models/account.model";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const jwt = localStorage.getItem(Account.boraAccountJwt);
        if (jwt) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${jwt}`
                }
            });

            return next.handle(req);
        }
        else {
            return next.handle(req);
        }
    }
}