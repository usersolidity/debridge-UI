import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header';
import { AppLobbyComponent } from './app-lobby/app-lobby.component';
import { AppTransferComponent } from './app-transfer/app-transfer.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { AppCurrencyDetailsComponent } from './app-currency-details/app-currency-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppWalletComponent } from './app-wallet/app-wallet.component';
import { AppTransferRecordsTableComponent } from './app-transfer-records-table';
import { DlgSwitchNetworkComponent } from './dlg-switch-network/dlg-switch-network.component';
import { DlgSelectCoinComponent } from './dlg-select-coin/dlg-select-coin.component';

import { BrowserStorageProvider } from '../shared/browser-storage-provider';
import { UserSessionProvider } from '../shared/user-session-provider';
import { EventBus } from '../shared/event-bus';
import { Web3Service } from '../shared/web3-service';
import { UnlockWalletComponent } from './unlock-wallet';
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
    ServiceProxyModule
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
    UnlockWalletComponent
  ],

  providers: [
    BrowserStorageProvider,
    UserSessionProvider,
    EventBus,
    Web3Service,
    { provide: API_BASE_URL, useValue: environment.remoteServiceBaseUrl } // выставляем url web api для проксей
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
