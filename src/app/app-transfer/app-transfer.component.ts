import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComponentBase } from '../../shared/component-base';
import { EventBus } from '../../shared/event-bus';
import { Web3Service } from '../../shared/web3-service';
import BigNumber from "bignumber.js";
import { DlgSwitchNetworkComponent } from '../dlg-switch-network';

import { throwError, merge } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { DlgSelectCoinComponent } from '../dlg-select-coin';

import networks from './networks.data';
import { UnlockWalletComponent } from '../unlock-wallet';
import { PairEventDTO, PairsServiceProxy } from '../../service-proxies/service-proxies';

@Component({
  selector: 'app-transfer',
  templateUrl: './app-transfer.component.html',
  styleUrls: ['./app-transfer.component.scss']
})
export class AppTransferComponent extends ComponentBase implements OnInit {

  constructor(
    private _dialog: MatDialog,
    private eventBus: EventBus,
    private pairsService: PairsServiceProxy,
    //todo: add component base with web3Service
    private web3Service: Web3Service
  ) { super() }

  waiting: boolean = false;
  account: string = "";

  //TODO: get from selector
  fromNetwork: any;
  toNetwork: any;

  //TODO: get from component select
  fromCurrensySymbol: string = "";
  toCurrensySymbol: string = "";


  inputAmount: number = 0;
  allowance: number = 0;

  minAmount: number = 0;
  transferFee: number = 0;

  //TODO: make with ngmodel changed
  public get outputAmount(): number {
    if (this.pairFrom) {
      let outAmount = new BigNumber(this.inputAmount).minus(this.transferFee).toNumber();
      return outAmount;
    }
    return 0;
  }


  public allPairs: Array<PairEventDTO> = [];
  public pairFrom: PairEventDTO;
  public pairTo: PairEventDTO;

  outputBalance: number = 0;
  inputBalance: number = 0;

  chainTo: number;
  isApproved: boolean = false;

  async ngOnInit() {
    this.getAllPairs();

    this.eventBus.loginEvent.subscribe(result => {
      console.log('loginEvent subscription:' + result);
      this.eventLogin(result);
    });

    this.eventBus.logoutEvent.subscribe(result => {
      console.log('logoutEvent subscription:' + result);
      this.eventLogout();
    });


    await this.web3Service.initWeb3();

  }

  async setPairFrom(pair: PairEventDTO): Promise<void> {
    this.pairFrom = pair;
    //TODO: check chainId
    this.pairTo = this.allPairs.find(t => t.debridgeId == pair.debridgeId && t.chainId != pair.chainId);
    this.fromCurrensySymbol = this.pairFrom.tokenSymbol;
    this.toCurrensySymbol = this.pairTo.tokenSymbol;
    this.chainTo = this.pairTo.chainId;

    this.minAmount = new BigNumber(this.pairFrom.minAmount).shiftedBy(-this.pairFrom.tokenDecimals).toNumber();

    ////TODO: when selected currency find debridgeId
    //this.debridgeId = await this.web3Service.GetDebridgeId(42, "0x0000000000000000000000000000000000000000");
    //console.log(this.debridgeId);
    //this.debrige = await this.web3Service.GetDebridge(this.debridgeId);
    //console.log(this.debrige);
    var supportedChain = await this.web3Service.GetSupportedChainIds(this.pairFrom.debridgeId);
    console.log('supportedChain');
    console.log(supportedChain);


    this.fromNetwork = networks.find(n => n.chainId == this.web3Service.chainIdNumber);
    //TODO: add selector chain TO 
    this.toNetwork = networks.find(n => n.chainId == parseInt(supportedChain[0]));

    this.transferFee = new BigNumber(this.pairFrom.transferFee).shiftedBy(-this.pairFrom.tokenDecimals).toNumber();

    this.updateUserData();
  }

  UpdateBalanceFrom(): void {
    if (this.pairFrom && this.account) {
      if (this.pairFrom.tokenAddress == "0x0000000000000000000000000000000000000000") {
        this.web3Service.getEthBalance(this.account).then((value) => {
          console.log(`inputBalance ${value}`);
          this.inputBalance = this.toNumberFromWei(value, 18);
          this.inputAmount = this.inputBalance;
        });
      }
      else {
        this.web3Service.GetTokenBalance(this.account, this.pairFrom.tokenAddress).then((value) => {
          console.log(`inputTokenBalance ${value}`);
          this.inputBalance = this.toNumberFromWei(value, this.pairFrom.tokenDecimals);
          this.inputAmount = this.inputBalance;
        });
      }
    }
  }


  updateAllowance(account: string, tokenForspend: string, forContractAddress: string): void {
    if (tokenForspend == "0x0000000000000000000000000000000000000000") {
      this.isApproved = true;
    }
    else {
      this.web3Service.GetAllowance(account, tokenForspend, forContractAddress).then((resp) => {
        console.log(`GetAllowance: ${resp.toString()}`);
        //TODO: isApproved = resp > 0;
        this.isApproved = resp > 0;
      });
    }
  }

  getAllPairs(): void {
    console.log('updateTransferRecords');
    this.pairsService.getAll()
      //.finally(() => {
      //    this.unblockUI();
      //})
      .subscribe(result => {
        console.log(result);
        this.allPairs = result;
        //TODO: add selecror for pair from 
        this.setPairFrom(this.allPairs.find(t => t.chainId == this.web3Service.chainIdNumber));
      },
        error => {
          console.error(error);
          //this.showError(error.json().message);
        });
  }

  //TODO: need to call when pairFrom changed
  updateUserData(): void {
    this.UpdateBalanceFrom();
    this.updateAllowance(this.account, this.pairFrom.tokenAddress, this.web3Service.whiteDebridgeAddress);
  }

  approveClick(): void {
    this.waiting = true;

    this.web3Service.ApproveOn(this.account, this.pairFrom.tokenAddress, this.web3Service.whiteDebridgeAddress)
      .then((response: any) => {
        this.showSuccessModal('Confirmed transaction');
        this.updateUserData();
      }).catch((response: any) => {
        console.info('catch');
        console.info(response);
      }).finally(() => {
        console.info('finally');
        this.waiting = false;
      });
  }

  async swapClick(): Promise<void> {
    console.log('swapClick');
    this.waiting = true;
    var payableAmount = 0;
    if (this.pairFrom.tokenAddress == "0x0000000000000000000000000000000000000000") {
      payableAmount = this.inputAmount;
    }

    var receiver = this.account;
    var tokenAmount = this.inputAmount;
    console.log(this.pairFrom);

    if (this.pairFrom.chainId == this.pairFrom.eventChainId) {
      this.web3Service.SendDebridge(this.account, payableAmount, this.pairFrom.debridgeId, receiver, tokenAmount, this.pairFrom.tokenDecimals, this.chainTo).then((response: any) => {
        this.showSuccessModal('Confirmed transaction');
        this.updateUserData();
        //TODO: useless no records in bs
        this.eventBus.updateTransferRecords.emit();
      }).catch((response: any) => {
        console.info('catch');
        console.info(response);
      }).finally(() => {
        console.info('finally');
        this.waiting = false;
      });
    }
    else {
      this.web3Service.BurnDebridge(this.account, this.pairFrom.debridgeId, receiver, tokenAmount, this.pairFrom.tokenDecimals).then((response: any) => {
        this.showSuccessModal('Confirmed transaction');
        this.updateUserData();
        //TODO: useless no records in bs
        this.eventBus.updateTransferRecords.emit();
      }).catch((response: any) => {
        console.info('catch');
        console.info(response);
      }).finally(() => {
        console.info('finally');
        this.waiting = false;
      });
    }
  }

  switchNetwork() {
    this._dialog.open(DlgSwitchNetworkComponent, {
      backdropClass: 'dlg-switch-network-backdrop',
      panelClass: ['dlg-switch-network-panel']
    });
  }


  async selectCoin() {
    const dialogRef = this._dialog.open(DlgSelectCoinComponent, {
      backdropClass: 'dlg-select-coin-backdrop',
      panelClass: ['dlg-select-coin-panel']
    });

    const source = dialogRef.afterClosed();
    const success$ = source
      .pipe(filter<boolean>((val) => val));
    const error$ = source
      .pipe(filter((val) => !val))
      .pipe(switchMap((error) => throwError(`${error}`)));

    let res;
    try {
      // It's a selected coin
      res = await merge(success$, error$).toPromise();
    } catch (err) {
      return;
    }
  }

  async unlockWalletClick() {
    const dialogRef = this._dialog.open(UnlockWalletComponent, {
      //backdropClass: 'dlg-select-coin-backdrop',
      panelClass: ['unlock-wallet-panel']
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


  async eventLogin(username: string) {
    console.log('eventLogin');
    console.log(username);
    this.account = username;
    this.updateUserData();
  }

  eventLogout(): void {
    console.log('signOut')
    this.account = "";
  }


}
