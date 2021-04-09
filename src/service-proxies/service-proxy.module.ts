import { NgModule } from "@angular/core";

import * as ApiServiceProxies from "./service-proxies";

@NgModule({
    providers: [
    ApiServiceProxies.SentEventServiceProxy,
    ApiServiceProxies.BurntEventServiceProxy,
    ApiServiceProxies.PairsServiceProxy
    ]
})
export class ServiceProxyModule { }
