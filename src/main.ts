import { enableProdMode, Injector } from "@angular/core";
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

//declare var toastr: any;
//toastr.options.positionClass = "toast-bottom-right";
//export var toastr: { options: { positionClass: "toast-bottom-right"; }; };

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).then(ngModuletRef => {
  console.log('platformBrowserDynamic')
  injector = ngModuletRef.injector;
}).catch(err => console.error(err));

/**
* Глобальный иньектор приложения
*/
export var injector: Injector;
