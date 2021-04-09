import { Injectable, EventEmitter } from "@angular/core";
import { PairEventDTO } from "../service-proxies/service-proxies";


@Injectable({
  providedIn: 'root',
})
export class EventBus {
  constructor() {

  }


  public loginEvent: EventEmitter<string> = new EventEmitter<string>();
  public logoutEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  public updateTransferRecords: EventEmitter<void> = new EventEmitter<void>();

  public fromPairChanged: EventEmitter<PairEventDTO> = new EventEmitter<PairEventDTO>();

  public accountsChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  public chainChanged: EventEmitter<string> = new EventEmitter<string>();
  public walletConnect: EventEmitter<string> = new EventEmitter<string>();
  public walletDisconnect: EventEmitter<string> = new EventEmitter<string>();
}
