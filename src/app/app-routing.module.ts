import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppLobbyComponent } from './app-lobby/app-lobby.component';
import { AppTransferComponent } from './app-transfer/app-transfer.component';

const routes: Routes = [{
    path: '',
    children: [{
        path: '',
        component: AppLobbyComponent
    }, {
        path: 'transfer',
        component: AppTransferComponent
    }]
}];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
