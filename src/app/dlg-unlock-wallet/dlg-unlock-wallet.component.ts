import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserSessionProvider } from '../../shared/user-session-provider';
import { EventBus } from '../../shared/event-bus';
import { Web3Service } from "../../shared/web3-service";
import { ComponentBase } from '../../shared/component-base';
import { AlertService } from '../shared-dlg.module';

@Component({
  selector: 'dlg-unlock-wallet',
  templateUrl: './dlg-unlock-wallet.component.html',
  styleUrls: ['./dlg-unlock-wallet.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DlgUnlockWalletComponent extends ComponentBase implements OnInit {

  constructor(
    private _alertSrv: AlertService,
    private userSessionProvider: UserSessionProvider,
    private eventBus: EventBus,
    private web3Service: Web3Service) {
    super();
  }

  async ngOnInit() {
    
  }

  public async unlockMetamaskClick(reload = true) {
    console.log('unlockMetamaskClick');
    try {
      await this.web3Service.unlockMetamask(reload);
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

  public async unlockWalletconnectClick(reload = true) {
    try {
      await this.web3Service.unlockWalletconnect(reload);
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
}
