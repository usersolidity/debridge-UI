import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { AppRoutingModule } from './app-routing.module';
import { SharedDlgModule } from './shared-dlg.module';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header';
import { AppLobbyComponent } from './app-lobby/app-lobby.component';
import { AppTransferComponent } from './app-transfer/app-transfer.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { AppCurrencyDetailsComponent } from './app-currency-details/app-currency-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppWalletComponent } from './app-wallet/app-wallet.component';
import { AppTransferRecordsTableComponent } from './app-transfer-records-table';
import { DlgSwitchNetworkComponent } from './dlg-switch-network';
import { DlgSelectCoinComponent } from './dlg-select-coin';
import { DlgWalletComponent } from './dlg-wallet';
import { DlgUnlockWalletComponent } from './dlg-unlock-wallet';

import { BrowserStorageProvider } from '../shared/browser-storage-provider';
import { UserSessionProvider } from '../shared/user-session-provider';
import { EventBus } from '../shared/event-bus';
import { Web3Service } from '../shared/web3-service';
import { PipesModule } from '../shared/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { ServiceProxyModule } from '../service-proxies/service-proxy.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../service-proxies/service-proxies';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    MatSelectModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule,
    MatTabsModule,
    BrowserAnimationsModule,
    PipesModule,
    HttpClientModule,
    ServiceProxyModule,
    SharedDlgModule
  ],
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppLobbyComponent,
    AppTransferComponent,
    AppFooterComponent,
    AppCurrencyDetailsComponent,
    AppWalletComponent,
    AppTransferRecordsTableComponent,
    DlgSwitchNetworkComponent,
    DlgSelectCoinComponent,
    DlgWalletComponent,
    DlgUnlockWalletComponent
  ],

  providers: [
    BrowserStorageProvider,
    UserSessionProvider,
    EventBus,
    Web3Service,
    { provide: API_BASE_URL, useValue: environment.remoteServiceBaseUrl }, // выставляем url web api для проксей
    {
      provide: APP_INITIALIZER,
      useFactory: InitFactory,
      deps: [
        UserSessionProvider,
        Web3Service
      ],
      multi: true
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

function InitFactory(userSession: UserSessionProvider, web3Service: Web3Service) {
  return async function(): Promise<void> {
    // Make right init things here
  }
}
