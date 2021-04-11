import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

import { throwError, merge } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { EventBus } from '../../shared/event-bus';
import { UserSessionProvider } from '../../shared/user-session-provider';
import { Web3Service } from '../../shared/web3-service';
import { DlgUnlockWalletComponent } from '../dlg-unlock-wallet';
import BigNumber from "bignumber.js";
import { ComponentBase } from '../../shared/component-base';
import { DlgWalletComponent } from '../dlg-wallet';
import { AlertService } from '../shared-dlg.module';

@Component({
  selector: 'app-wallet',
  templateUrl: './app-wallet.component.html',
  styleUrls: ['./app-wallet.component.scss']
})
export class AppWalletComponent extends ComponentBase implements OnInit {
  account: string | null;
  ethBalance: number | null;

  constructor(
    private _dialog: MatDialog,
    private _alertSrv: AlertService,
    private userSessionProvider: UserSessionProvider,
    private eventBus: EventBus,
    public web3Service: Web3Service
  ) {
    super();
    this.account = userSessionProvider.username;
    this.ethBalance = null;
  }

  async ngOnInit() {
    await this.web3Service.initWeb3();
    
    if (this.userSessionProvider.username) {
      if (this.userSessionProvider.providerName == this.web3Service.MetamaskName) {
        try {
          await this.web3Service.unlockMetamask(false);
        }
        catch (err) {
          console.error(err);
          if (err.name === "ChainError") {
            this._alertSrv.show(err.message, 'error');
            // this.showErrorModal(err.message);
          }
          this.userSessionProvider.finishSession();
        }
      }
      else if (this.userSessionProvider.providerName == this.web3Service.WalletconnectName) {
        try {
          await this.web3Service.unlockWalletconnect(false);
        }
        catch (err) {
          console.error(err);
          if (err.name === "ChainError") {
            this._alertSrv.show(err.message, 'error');
            // this.showErrorModal(err.message);
          }
          this.userSessionProvider.finishSession();
        }
      }
      else {
        this.userSessionProvider.finishSession();
        location.reload();
      }

      //if (this.account) {
      //  this.web3Service.getEthBalance(this.account).then((value) => {
      //    this.ethBalance = this.toNumberFromWeiFixed(value, 18);
      //  });
      //}
    }

    this.eventBus.loginEvent.subscribe(result => {
      console.log('loginEvent subscription:' + result);
      this.account = result;

      this.web3Service.getEthBalance(this.account).then((value) => {
        this.ethBalance = this.toNumberFromWeiFixed(value, 18);
      });
    });

    this.eventBus.accountsChanged.subscribe(result => {
      console.log('accountsChanged subscription:' + result);
      location.reload();
    });

    this.eventBus.chainChanged.subscribe(chainId => {
      console.log('chainChanged subscription:' + chainId);
      this.showSuccess("Chain was changed");
      //alert('chainChanged subscription:' + chainId);

      if (chainId != this.web3Service.chainId) {
        //if new chain is Ethereum 
        if (chainId === '0x01' || chainId === '0x2a') {
          this.userSessionProvider.setETHNetwork();
        }
        //if new chain is BSC
        else if (chainId === '0x38' || chainId === '0x61') {
          this.userSessionProvider.setBSCNetwork();
        }
      }

      //location.reload();
    });

    this.eventBus.walletDisconnect.subscribe(result => {
      console.log('walletDisconnect subscription:' + result);
      this.userSessionProvider.finishSession();
      //this.signOut(false);
    });

  }

  //decimalPlaces: number, roundingMode?: BigNumber.RoundingMode
  toNumberFromWeiFixed(input: string, decimals: number, decimalPlaces: number = 2, roundingMode: BigNumber.RoundingMode = 1) {
    return parseFloat(new BigNumber(input).shiftedBy(-decimals).toFixed(decimalPlaces, roundingMode))
  }


  async unlockWalletClick() {
    const dialogRef = this._dialog.open(DlgUnlockWalletComponent, {
      backdropClass: 'dlg-unlock-wallet-backdrop',
      panelClass: ['dlg-unlock-wallet-panel'],
      scrollStrategy: new NoopScrollStrategy()
    });

    //const source = dialogRef.afterClosed();
    //const success$ = source
    //  .pipe(filter<boolean>((val) => val));
    //const error$ = source
    //  .pipe(filter((val) => !val))
    //  .pipe(switchMap((error) => throwError(`${error}`)));

    //let res;
    //try {
    //  // It's a selected coin
    //  res = await merge(success$, error$).toPromise();
    //} catch (err) {
    //  return;
    //}
  }



  async signOutClick() {
    await this.signOut();
    this.eventBus.logoutEvent.emit(true);
  }

  async signOut() {
    console.log('signOut');
    this.userSessionProvider.finishSession();
    await this.web3Service.WalletDisconnect();
    location.reload();
    return;
  }

  async showWalletDlg() {
    const dialogRef = this._dialog.open(DlgWalletComponent, {
      backdropClass: 'dlg-wallet-backdrop',
      panelClass: ['dlg-wallet-panel'],
      scrollStrategy: new NoopScrollStrategy()
    });

    const source = dialogRef.afterClosed();
    const success$ = source
      .pipe(filter<boolean>((val) => val));
    const error$ = source
      .pipe(filter((val) => !val))
      .pipe(switchMap((error) => throwError(`${error}`)));

    try {
      await merge(success$, error$).toPromise();
    } catch (err) {
      return;
    }

    this.signOut();
  }
}
