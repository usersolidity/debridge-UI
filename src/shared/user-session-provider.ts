import { Injectable } from "@angular/core";
import Web3 from "web3";
import { BrowserStorageProvider } from "./browser-storage-provider";

@Injectable()
export class UserSessionProvider {

  constructor(private browserStorage: BrowserStorageProvider) {
    this.storage = browserStorage.getStorage(localStorage);
  }

  private storage: Storage = localStorage;

  private usernameKey: string = "username";
  private langKey: string = "lang";
  private lightModeKey: string = "lightMode";
  private chainKey: string = "chain";


  private isSessionStartedKey: string = "isSessionStarted";

  /**
   * Логин текущего пользователя
   */
  public get username(): string | null {
    return this.storage.getItem(this.usernameKey);
  }

  public get getLang(): string | null {
    return this.storage.getItem(this.langKey);
  }

  public setLang(lang: string,): void {
    this.storage.setItem(this.langKey, lang);
  }

  public get getIsLightMode(): boolean {
    return this.storage.getItem(this.lightModeKey) != undefined;
  }

  public setDarkMode(): void {
    this.storage.removeItem(this.lightModeKey);
  }

  public setLightMode(): void {
    this.storage.setItem(this.lightModeKey, "true");
  }


  public setBSCNetwork(): void {
    this.storage.setItem(this.chainKey, "BSC");
  }

  public setETHNetwork(): void {
    this.storage.removeItem(this.chainKey);
    //this.storage.setItem(this.chainKey, "ETH");
  }

  public get getIsBSC(): boolean {
    return this.storage.getItem(this.chainKey) != undefined;
  }

  public getChainKey() {
    return this.storage.getItem(this.chainKey);
  }

  /**
   * Сессия начата
   */
  public get isSessionStarted(): boolean {
    return this.storage.getItem(this.isSessionStartedKey) != undefined;
  }




  public get providerName(): string | null {
    return this.storage.getItem(this.isSessionStartedKey);
  }

  public startSession(username: string, providerName: string): void {
    this.storage.setItem(this.usernameKey, username);
    this.storage.setItem(this.isSessionStartedKey, providerName);
  }

  public finishSession(): void {
    this.storage.removeItem(this.usernameKey);
    this.storage.removeItem(this.isSessionStartedKey);
  }
}
