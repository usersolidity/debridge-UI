import swal from "sweetalert2"
import BigNumber from "bignumber.js";
declare const window: any;
import { Web3Service } from "./web3-service";
import { injector } from "../main";
import { environment } from "../environments/environment";


//declare var toastr: { error: (arg0: string) => void; warning: (arg0: string) => void; info: (arg0: string) => void; success: (arg0: string) => void; };

/**
 * Базовый класс для всех компонент приложения
 */
export abstract class ComponentBase {
  public isWeb3Disabled: boolean = false;

  public longTimeUpdate: number = 60000;
  public expectedBlockTime: number = 30000;


  //public get chainId(): string {
  //    if (environment.production)
  //        return '0x2a';
  //    else
  //        return '0x01';
  //};


  //TODO: chack network
  //public get chainId(): string {
  //  return this.web3Service.chainId;
  //};

  ////TODO: check network
  //public get chainId(): string {
  //  return this.web3Service.chainId;
  //};

  //public get chainIdNumber(): number {
  //  return parseInt(this.chainId);
  //};


  //TODO: inject is undefined
  //public web3Service: Web3Service;

  constructor() {
    //console.log(injector);
    //this.web3Service = injector.get(Web3Service);
  }

  async initWeb3() {
    //this.provider = await detectEthereumProvider();
    //if (this.provider) {
    //    this.web3 = new Web3(this.provider);
    //}
    //else {
    //    this.isWeb3Disabled = true;
    //}

    //await this.updateChanId();

    //this.web3 = new Web3("https://mainnet.infura.io/v3/24327bb89ca04f38991d4b88036b70fa");
    //this.chainId = '0x2a';

    //this.chainId = '0x01';

    //await this.WalletConnect();
  }



  //async updateChanId() {
  //    //if (this.chainId)
  //    //    return this.chainId;
  //    //else {
  //    this.chainId = await window.ethereum.request({ method: 'eth_chainId' });
  //    console.log("chainId: " + this.chainId);
  //    //    return this.chainId;
  //    //}
  //}

  //public get isBNBChain(): boolean {
  //  //                                  testnet bsc
  //  if (this.chainId === '0x38' || this.chainId === '0x61') {
  //    return true;
  //  }
  //  return false;
  //}


  //public get isETHChain(): boolean {
  //  if (this.chainId === '0x01' || this.chainId === '0x1' || this.chainId === '0x2a') {
  //    return true;
  //  }
  //  return false;
  //}

  //public get chainSymbol(): string {
  //  if (this.chainId === '0x01' || this.chainId === '0x1' || this.chainId === '0x2a') {
  //    return "ETH";
  //  }
  //  //                                  testnet bsc
  //  else if (this.chainId === '0x38' || this.chainId === '0x61') {
  //    return "BNB";
  //  }
  //  return "ETH";
  //}


  /**
   * Показывает всплывающее сообщение об ошибке
   * @param message Текст сообщения
   */
  public showError(message: string) {
    //toastr.error(message);
  }

  /**
   * Показывает сообщение об ошибке в модальном окне
   * @param message Текст сообщения
   */
  public showErrorModal(message: string) {
    swal.fire({
      text: message,
      icon: "error"
    });
  }

  /**
   * Показывает всплывающее сообщение с предупреждением
   * @param message Текст сообщения
   */
  public showWarning(message: string) {
    //toastr.warning(message);
  }

  /**
   * Показывает сообщение с предупреждением в модальном окне
   * @param message Текст сообщения
   */
  public showWarningModal(message: string) {
    swal.fire({
      text: message,
      icon: 'warning'
    });
  }

  /**
   * Показывает всплывающее сообщение с информацией
   * @param message Текст сообщения
   */
  public showInfo(message: string) {
    //toastr.info(message);
  }

  /**
   * Показывает сообщение с информацией в модальном окне
   * @param message Текст сообщения
   */
  public showInfoModal(message: string) {
    swal.fire({
      text: message,
      icon: "info"
    });
  }

  /**
   * Показывает всплывающее сообщение об успехе
   * @param message Текст сообщения
   */
  public showSuccess(message: string) {
    //toastr.success(message);
  }

  /**
   * Показывает сообщение об ошибке в модальном окне
   * @param message Текст сообщения
   */
  public showSuccessModal(message: string) {
    swal.fire({
      text: message,
      icon: "success"
    });
  }

  public showInfoHTMLModal(message: string, confirmButtonText: string) {
    swal.fire({
      html: message,
      icon: "info",
      confirmButtonText: confirmButtonText
    });
  }

  public showWarningHTMLModal(message: string, confirmButtonText: string) {
    swal.fire({
      html: message,
      icon: "warning",
      confirmButtonText: confirmButtonText,
      allowEscapeKey: false,
      allowOutsideClick: false
    });
  }

  explorerURL: string = "#";

  showTransactionSumbited(txId: string, isBNBChain: boolean) {
    let subResp = 'Transaction Submitted';
    let closeResp = 'Close';
    let viewResp = 'View on Etherscan';
    if (isBNBChain)
      viewResp = 'View on BscScan';
    var stringHTML = `<p class="trans_submitted">${subResp}</p><a href="${this.explorerURL}${txId}" target="_blank" class="view_etherscan">${viewResp}</a>`;

    this.showInfoHTMLModal(stringHTML, closeResp);
    //translate.get('Transaction Submitted')
    //    .subscribe((subResp: string) => {
    //        translate.get('View on Etherscan')
    //            .subscribe((viewResp: string) => {
    //                translate.get('Close')
    //                    .subscribe((closeResp: string) => {
    //                        var stringHTML = `<p class="trans_submitted">${subResp}</p><a href="https://etherscan.io/tx/${txId}" target="_blank" class="view_etherscan">${viewResp}</a>`;

    //                        this.showInfoHTMLModal(stringHTML, closeResp);
    //                    });
    //            });
    //    });
  }


//  /**
//* Создаёт корректный moment для даты (для избежания проблем на сервере с часовым поясом)
//* @param date
//*/
//  toMomentDate(date: Date): moment.Moment | undefined {
//    if (!date)
//      return undefined;
//    let momentDate = moment(date);
//    return moment.utc(momentDate.format("DD.MM.YYYY"), "DD.MM.YYYY");
//  }

  toNumberFromWei(input: string, decimals: number) {
    return new BigNumber(input).shiftedBy(-decimals).toNumber()
  }

  //decimalPlaces: number, roundingMode?: BigNumber.RoundingMode
  toNumberFromWeiFixed(input: string, decimals: number, decimalPlaces: number = 2, roundingMode: BigNumber.RoundingMode = 1) {
    return parseFloat(new BigNumber(input).shiftedBy(-decimals).toFixed(decimalPlaces, roundingMode))
  }

  //#region isMobile

  Opera(): boolean {
    return navigator.userAgent.match(/Opera Mini/i) != null;
  }
  Android(): boolean {
    return navigator.userAgent.match(/Android/i) != null;
  }
  iOS(): boolean {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i) != null;
  }
  Windows(): boolean {
    return navigator.userAgent.match(/IEMobile/i) != null || navigator.userAgent.match(/WPDesktop/i) != null;
  }

  isMobile(): boolean {
    return (this.Android() || this.iOS() || this.Opera() || this.Windows());
  }
  //#endregion isMobile
}
