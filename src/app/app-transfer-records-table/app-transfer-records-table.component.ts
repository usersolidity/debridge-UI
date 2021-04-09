import { Component, Input, OnInit } from '@angular/core';
import {
  BehaviorSubject
} from 'rxjs';
import { BurntEventDTO, SentEventDTO, SentEventServiceProxy, BurntEventServiceProxy } from '../../service-proxies/service-proxies';
import { EventBus } from '../../shared/event-bus';
import BigNumber from "bignumber.js";
import { TransferRecordsSource } from './app-transfer-records-table.data-source';
import { Web3Service } from '../../shared/web3-service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DlgSwitchNetworkComponent } from '../dlg-switch-network';
import { ComponentBase } from '../../shared/component-base';

@Component({
  selector: 'app-transfer-records-table',
  templateUrl: './app-transfer-records-table.component.html',
  styleUrls: ['./app-transfer-records-table.component.scss']
})
export class AppTransferRecordsTableComponent extends ComponentBase implements OnInit {
  @Input() selectedChainId: number;
  @Input() isPayback: boolean;
  //public dataSource: TransferRecordsSource;

  //private _columnsSbj = new BehaviorSubject<string[]>([
  //  'id', 'tx', 'token', 'amount', '__breakpoint', 'confirmed', 'signed', 'action'
  //]);

  //public columns$ = this._columnsSbj.asObservable();

  waiting: boolean = false;

  public allEvents: Array<SentEventDTO> = [];

  //public burntEvents: Array<BurntEventDTO> = [];

  account: string = "";

  web3ChainId: number;

  constructor(private _dialog: MatDialog, private sentEventService: SentEventServiceProxy, private burntEventService: BurntEventServiceProxy, private eventBus: EventBus, private web3Service: Web3Service) {
    super();
    this.web3ChainId = web3Service.chainIdNumber;
    //this.dataSource = new TransferRecordsSource();
  }
  //transactionHash!: string | undefined;
  //chainId!: number;
  //blockNumber!: number;
  //submissionId!: string | undefined;
  //debridgeId!: string | undefined;
  //amount!: string | undefined;
  //receiver!: string | undefined;
  //nonce!: number;
  //chainIdTo!: number;
  //tokenAddress!: string | undefined;
  //tokenDecimals!: number;
  //tokenName!: string | undefined;
  //tokenSymbol!: string | undefined;
  //isConfirmed!: boolean;
  //isExecuted!: boolean;

  displayedColumns: string[] = ['nonce', 'transactionHash', 'amount', 'tokenSymbol', 'submissionApproved', 'action'];

  ngOnInit(): void {
    console.log(`chainId: ${this.web3Service.chainId}`);

    this.eventBus.loginEvent.subscribe(result => {
      console.log('loginEvent subscription:' + result);
      this.eventLogin(result);
    });

    this.eventBus.logoutEvent.subscribe(result => {
      console.log('logoutEvent subscription:' + result);
      this.eventLogout();
    });

    this.eventBus.updateTransferRecords.subscribe(result => {
      this.UpdateData();
    });
  }

  async eventLogin(username: string) {
    console.log('eventLogin');
    console.log(username);
    this.account = username;
    this.UpdateData();
  }

  UpdateData(): void {
    console.log('updateTransferRecords');
    if (this.isPayback) {
      this.burntEventService.getMy(this.account, this.selectedChainId)
        //.finally(() => {
        //    this.unblockUI();
        //})
        .subscribe(result => {
          console.log(result);
          this.allEvents = result;
        },
          error => {
            console.error(error);
            //this.showError(error.json().message);
          });
    }
    else {
      this.sentEventService.getMy(this.account, this.selectedChainId)
        //.finally(() => {
        //    this.unblockUI();
        //})
        .subscribe(result => {
          console.log(result);
          this.allEvents = result;
        },
          error => {
            console.error(error);
            //this.showError(error.json().message);
          });
    }
   
  }


  getAmount(item: any): number {
    if (item.amount) {
      return new BigNumber(item.amount).shiftedBy(-item.tokenDecimals).toNumber();
    }
    else
      return 0;
  }

  eventLogout(): void {
    console.log('signOut')
    this.account = "";
    this.allEvents = [];
  }


  async claimClick(item: any): Promise<void> {
    console.log('claimClick');
    this.waiting = true;


    if (item.debridgeId && item.receiver && item.amount) {
      if (this.isPayback) {
        this.web3Service.ClaimDebridge(this.account, item.debridgeId, item.receiver, item.amount, item.nonce).then((response: any) => {
          item.isExecuted = true;
          this.showSuccessModal('Confirmed transaction');
        }).catch((response: any) => {
          console.info('catch');
          console.info(response);
        }).finally(() => {
          console.info('finally');
          this.waiting = false;
        });
      }
      else {
        this.web3Service.MintDebridge(this.account, item.debridgeId, item.receiver, item.amount, item.nonce).then((response: any) => {
          item.isExecuted = true;
          this.showSuccessModal('Confirmed transaction');
        }).catch((response: any) => {
          console.info('catch');
          console.info(response);
        }).finally(() => {
          console.info('finally');
          this.waiting = false;
        });
      }
    }
  }

  //async claimBurntClick(item: BurntEventDTO): Promise<void> {
  //  console.log('claimClick');
  //  this.waiting = true;

  //  if (item.debridgeId && item.receiver && item.amount) {
  //    this.web3Service.ClaimDebridge(this.account, item.debridgeId, item.receiver, item.amount, item.nonce).then((response: any) => {
  //      item.isExecuted = true;
  //      this.showSuccessModal('Confirmed transaction');
  //    }).catch((response: any) => {
  //      console.info('catch');
  //      console.info(response);
  //    }).finally(() => {
  //      console.info('finally');
  //      this.waiting = false;
  //    });
  //  }
  //}

  switchNetworkClick() {
    this._dialog.open(DlgSwitchNetworkComponent, {
      backdropClass: 'dlg-switch-network-backdrop',
      panelClass: ['dlg-switch-network-panel']
    });
  }

}
