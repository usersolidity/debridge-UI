////import { RequestOptionsArgs, Headers } from "@angular/http"
////import { UserSessionProvider } from "shared/user-session-provider";

////import { Observable } from "rxjs";
////import { Http } from "@angular/http";
//////import "rxjs/add/operator/map";
////import { injector } from "main";
////import { API_BASE_URL } from "service-proxies/service-proxies";
////import { HttpHeaders } from "@angular/common/http";
////import { map } from 'rxjs/operators';

export class ServiceProxyBase {

  constructor() {
    //this.userSessionProvider = injector.get(UserSessionProvider);
    //this.httpEngine = injector.get(Http);
    //this.url = injector.get(API_BASE_URL);
  }

  //private userSessionProvider: UserSessionProvider;
  //private httpEngine: Http;
  //private url: string;

  //transformOptions(options: RequestOptionsArgs): Promise<RequestOptionsArgs> {
  //  //if (this.userSessionProvider.isSessionStarted)
  //  //  options.headers.append("Authorization", "Bearer " + this.userSessionProvider.token);

  //  return Promise.resolve(options);
  //  }



    transformOptions(options: any): Promise<any> {
        //if (this.userSessionProvider.isSessionStarted)
        //  headers.append("Authorization", "Bearer " + this.userSessionProvider.token);

        return Promise.resolve(options);
    }
}
