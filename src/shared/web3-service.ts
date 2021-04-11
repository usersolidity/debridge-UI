import { Injectable, EventEmitter } from "@angular/core";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
//import { EventBus } from "./event-bus";
import detectEthereumProvider from "@metamask/detect-provider";
import BigNumber from "bignumber.js";

import IERC20 from '../assets/abi/IERC20.json';
import ERC20Basic from '../assets/abi/ERC20Basic.json';
import WhiteDebridge from '../assets/abi/WhiteDebridge.json';


import { environment } from "../environments/environment";
import { EventBus } from "./event-bus";
import { UserSessionProvider } from "./user-session-provider";
import { error } from "console";
//import { UserSessionProvider } from "./user-session-provider";

declare const window: any;

export class ChainError extends Error {
  constructor(message: any) {
    super(message);
    this.name = "ChainError";
  }
}


@Injectable({
  providedIn: 'root',
})

export class Web3Service {
  public MetamaskName: string = "metamask";
  public WalletconnectName: string = "walletconnect";

  public readonly IERC20Abi: any;
  public readonly ERC20BasicAbi: any;
  public readonly whiteDebridgeAbi: any;

  public web3: Web3 = new Web3();

  private walletConnectProvider: WalletConnectProvider = new WalletConnectProvider({
    rpc: {
      1: "https://mainnet.infura.io/v3/24327bb89ca04f38991d4b88036b70fa",
      42: "https://kovan.infura.io/v3/24327bb89ca04f38991d4b88036b70fa",
      //BSC mainnet 56 
      56: "https://bsc-dataseed.binance.org/",
      //BSC testnet
      97: "https://data-seed-prebsc-1-s1.binance.org:8545/"
    },
  });

  private ethereumProvider: any;

  //TODO: chack network
  public get chainId(): string {
    if (environment.production) {
      if (this.userSessionProvider.getIsBSC)
        return '0x38';
      else
        return '0x01';
    }
    //testnet
    else {
      if (this.userSessionProvider.getIsBSC)
        //Работаем с mainnet
        return '0x38';
        //return '0x61';
      else
        return '0x2a';
    }
  };

  public get chainIdNumber(): number {
    return parseInt(this.chainId);
  };



  public get whiteDebridgeAddress(): string {
    //                             testnet kovan
    if (this.chainId === '0x01' || this.chainId === '0x1' || this.chainId === '0x2a') {
      return environment.eth.whiteDebridgeAddress
    }
    //                                  testnet bsc
    else if (this.chainId === '0x38' || this.chainId === '0x61') {
      return environment.bsc.whiteDebridgeAddress
    }
    throw new Error('Unsupported chain');
  }

  constructor(private eventBus: EventBus, private userSessionProvider: UserSessionProvider) {
    console.log('Web3Service constructor');
    this.IERC20Abi = IERC20.abi;
    this.ERC20BasicAbi = ERC20Basic.abi;
    this.whiteDebridgeAbi = WhiteDebridge.abi;
    //this.initWeb3();
  }


  async initWeb3() {
    console.log('initWeb3');
    this.ethereumProvider = await detectEthereumProvider({ timeout: 500 });
    if (this.ethereumProvider) {
      this.web3 = new Web3(this.ethereumProvider);

      var metamaskChainId = this.convertChainIdToHex(await this.web3.eth.getChainId());
      //await window.ethereum.request({ method: 'eth_chainId' });
      console.log("matamask chainId: " + metamaskChainId);
      if (metamaskChainId != this.chainId) {
        this.setWeb3OnCustomRPC();
      }
      //TOOD: that = this;
      //Reload when chain was changed in metamask (without connect wallet)
      var that = this;
      if (window.ethereum) {
        window.ethereum.on('chainChanged', function (chainId: string) {
          console.log('chainChanged');
          console.log(chainId);
          if (chainId === "0x1")
            chainId = "0x01";
          if (chainId != that.chainId) {
            //if new chain is Ethereum 
            if (chainId === '0x01' || chainId === '0x2a') {
              that.userSessionProvider.setETHNetwork();
            }
            //if new chain is BSC
            else if (chainId === '0x38' || chainId === '0x61') {
              that.userSessionProvider.setBSCNetwork();
            }
          }

          location.reload();
        });
      }
      return;
    }

    else {
      //this.isWeb3Disabled = true;
      if (!this.web3 || !this.web3.currentProvider) {
        this.setWeb3OnCustomRPC();
      }
    }

    //await this.updateChanId();

    //this.web3 = new Web3("https://mainnet.infura.io/v3/24327bb89ca04f38991d4b88036b70fa");
    //this.chainId = '0x2a';

    //this.chainId = '0x01';

    //await this.WalletConnect();
  }

  private web3ForEvents: Web3 = new Web3();

  private setWeb3OnCustomRPC() {
    console.log('set custom RPC for web3');
    if (environment.production) {
      if (this.userSessionProvider.getIsBSC)
        this.web3 = new Web3("https://bsc-dataseed.binance.org/");
      else
        this.web3 = new Web3("https://kovan.infura.io/v3/46e5f1638bb04dd4abb7f75bfd4f8898");
    }
    else {
      //BSC testnet
      if (this.userSessionProvider.getIsBSC)
        this.web3 = new Web3("https://bsc-dataseed.binance.org/");
      else
        this.web3 = new Web3("https://kovan.infura.io/v3/46e5f1638bb04dd4abb7f75bfd4f8898");
    }
  }


  //#region unlock wallet


  //async unlockWallet(): Promise<void> {
  public async unlockWalletconnect(reload = false): Promise<string> {
    var data = await this.WalletConnect();
    //this.account = data[0];
    this.userSessionProvider.startSession(data[0], this.WalletconnectName);
    this.eventBus.loginEvent.emit(data[0]);

    if (reload) {
      location.reload();
    }
    return data[0];
  }

  public async unlockMetamask(reload = false) {
    console.log('unlockMetamask');
    if (typeof window.ethereum == 'undefined') {
      //this.translate.get('MetaMask must be installed').subscribe((langResp: string) => {
      throw new ChainError('MetaMask must be installed');
      //});
      return false;
    }

    let chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log('chainId: ' + chainId);
    console.log('web3Service chainId: ' + this.chainId);
    if (chainId === "0x1")
      chainId = "0x01";
    if (this.chainId != chainId) {
      this.userSessionProvider.finishSession();
      if (this.userSessionProvider.getIsBSC)
        throw new ChainError(`Select BSC Network in your wallet.`);
      else
        throw new ChainError(`Select Kovan Network in your wallet.`);

      return false;
    }

    //if (environment.production) {
    //    if (chainId != '0x01' && chainId != '0x1' && chainId != '0x38') {
    //        this.showErrorModal(`Select Mainnet or BSC Network in MetaMask.`);
    //        //this.translate.get('select_right_metamask_network').subscribe((langResp: string) => {
    //        //    this.showErrorModal(langResp);
    //        //});
    //        return false;
    //    }
    //}
    //else {
    //    console.log(chainId);
    //    if (chainId != '0x2a' && chainId != '0x61') {
    //        this.showErrorModal(`Select Kovan or BSC Test Network in MetaMask.`);
    //        return false;
    //    }
    //}



    window.ethereum.enable().then((data: any) => {
      console.log("enabled");
      console.log(data);

      if (data.length > 0) {
        //this.account = data[0];
        this.userSessionProvider.startSession(data[0], this.MetamaskName);
        this.eventBus.loginEvent.emit(data[0]);

        //TOOD: that = this;
        var that = this;
        if (window.ethereum) {
          window.ethereum.on('accountsChanged', function (accounts: any) {
            console.log('accountsChanged');
            console.log(accounts);
            location.reload();
          })
          //window.ethereum.on('chainChanged', function (chainId: string) {
          //  console.log('chainChanged');
          //  console.log(chainId);
          //  if (chainId === "0x1")
          //    chainId = "0x01";
          //  if (chainId != that.chainId) {
          //    //if new chain is Ethereum 
          //    if (chainId === '0x01' || chainId === '0x2a') {
          //      that.userSessionProvider.setETHNetwork();
          //    }
          //    //if new chain is BSC
          //    else if (chainId === '0x38' || chainId === '0x61') {
          //      that.userSessionProvider.setBSCNetwork();
          //    }
          //  }

          //  location.reload();
          //})
        }

        //TODO: remove reload, add eventBus
        if (reload) {
          location.reload();
        }
      }
    }, (reason: any) => {
      console.log("My Permission to connect to Metamask was denied");
      console.log(reason);
    })

    return true;
  }

  //#endregion
  async WalletConnect() {
    console.log('WalletConnect');
    //  Create WalletConnect Provider
    this.walletConnectProvider = new WalletConnectProvider({
      rpc: {
        1: "https://mainnet.infura.io/v3/24327bb89ca04f38991d4b88036b70fa",
        42: "https://kovan.infura.io/v3/24327bb89ca04f38991d4b88036b70fa",
        //BSC mainnet 56 
        56: "https://bsc-dataseed.binance.org/",
        //BSC testnet
        97: "https://data-seed-prebsc-1-s1.binance.org:8545/"
      },
    });

    //  Enable session (triggers QR Code modal)
    var addresses = await this.walletConnectProvider.enable();
    console.log(addresses);

    //  Create Web3
    this.web3 = new Web3(this.walletConnectProvider as any);

    //  Get Chain Id
    //TODO: fix chain Id
    //var test = (await this.web3.eth.net.getId()).toString(16);
    var walletChainId = this.convertChainIdToHex(await this.web3.eth.getChainId());
    console.log('Wallet connect chainId: ' + walletChainId);

    if (this.chainId != walletChainId) {
      if (this.userSessionProvider.getIsBSC) {
        if (environment.production)
          throw new ChainError(`Select BSC Network in your wallet.`);
        else
          throw new ChainError(`Select BSC Testnet Network in your wallet.`);
      }
      else {
        if (environment.production)
          throw new ChainError(`Select Kovan Network in your wallet.`);
        else
          throw new ChainError(`Select Kovan Network in your wallet.`);
      }
      //this.userSessionProvider.finishSession();
    }

    //if (environment.production) {
    //    if (chainId != 1)
    //        throw new ChainError("`Select Mainnet Network.");
    //}
    //else {
    //    if (chainId != 42)
    //        throw new ChainError("Select Kovan Network.");
    //}

    // Subscribe to accounts change
    this.walletConnectProvider.on("accountsChanged", (accounts: string[]) => {
      console.log("accountsChanged " + accounts);
      this.eventBus.accountsChanged.emit(accounts)
    });

    // Subscribe to chainId change
    this.walletConnectProvider.on("chainChanged", (chainId: number) => {
      console.log("chainChanged" + chainId);

      this.eventBus.chainChanged.emit(this.convertChainIdToHex(chainId));
    });

    // Subscribe to session connection
    this.walletConnectProvider.on("connect", () => {
      console.log("connect");
      this.eventBus.walletConnect.emit("");
    });

    // Subscribe to session disconnection
    this.walletConnectProvider.on("disconnect", (code: number, reason: string) => {
      console.log(code, reason);
      this.eventBus.walletDisconnect.emit(reason);
    });


    //console.log(this.web3);
    return addresses;
  }


  public convertChainIdToHex(value: number): string {
    var hexChainId = '0x' + value.toString(16);
    if (hexChainId === '0x1')
      hexChainId = "0x01";
    return hexChainId;
  }

  async WalletDisconnect() {
    if (this.walletConnectProvider) {
      // Close provider session
      await this.walletConnectProvider.disconnect()
    }
  }


  ////#region web3
  async GetTransactionReceipt(tx: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.web3.eth.getTransactionReceipt(tx, (error, resp) => {
        console.log(resp);
        resolve(resp);
      });
    }) as Promise<any>;
  }

  async GetDecimals(contractAddress: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let contract = new this.web3.eth.Contract(this.ERC20BasicAbi, contractAddress);
      contract.methods.decimals().call({}, (error: any, resp: any) => {
        resolve(resp);
      });
    }) as Promise<any>;
  }

  async GetTotalSupply(contractAddress: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let contract = new this.web3.eth.Contract(this.ERC20BasicAbi, contractAddress);
      contract.methods.totalSupply().call({}, (error: any, resp: any) => {
        resolve(resp);
      });
    }) as Promise<any>;
  }


  async GetAllowance(account: string, tokenForspend: string, forContractAddress: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let contract = new this.web3.eth.Contract(this.ERC20BasicAbi, tokenForspend);
      contract.methods.allowance(account, forContractAddress).call({}, (error: any, resp: any) => {
        resolve(resp);
      });
    }) as Promise<any>;
  }

  async GetTokenBalance(account: string, tokenAddress: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let contract = new this.web3.eth.Contract(this.ERC20BasicAbi, tokenAddress);
      contract.methods.balanceOf(account).call({}, (error: any, resp: any) => {
        resolve(resp);
      });
    }) as Promise<any>;
  }

  async GetContractSymbol(tokenAddress: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let contract = new this.web3.eth.Contract(this.ERC20BasicAbi, tokenAddress);
      contract.methods.symbol().call({}, (error: any, resp: any) => {
        resolve(resp);
      });
    }) as Promise<any>;
  }

  ////async Approve(account: string, tokenForspend: string, forContractAddress: string): Promise<any> {
  ////    return new Promise((resolve, reject) => {
  ////        // Get contract instance
  ////        let tokenContract = new this.web3.eth.Contract(this.IERC20Abi, tokenForspend);

  ////        tokenContract.methods.approve(forContractAddress, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
  ////            .send({ from: account }, (error, resp) => {
  ////                console.log(resp);
  ////                resolve(resp);
  ////            });
  ////    }) as Promise<any>;
  ////}


  async ApproveOn(account: string, tokenForspend: string, forContractAddress: string): Promise<any> {
      return new Promise((resolve, reject) => {
          // Get contract instance
          let tokenContract = new this.web3.eth.Contract(this.IERC20Abi, tokenForspend);

          return tokenContract.methods.approve(forContractAddress, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
              .send({ from: account })
              .on('transactionHash', function (hash: any) {
                  console.info('transactionHash');
                  console.info(hash);
              })
              .on('receipt', function (receipt: any) {
                  console.info('receipt');
                  console.info(receipt);
                  resolve(receipt);
              })
              .on('error', function (error: any, receipt: any) {
                  console.error(error);
                  console.error(receipt);
                  reject(error);
                  //this.waiting = false;
              });
      }) as Promise<any>;
  }


  async getEthBalance(customerAddress: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.web3.eth.getBalance(customerAddress, (error, balance) => {
        resolve(balance);
      });
    }) as Promise<any>;
  }

  //#endregion web3


  //#region WhiteDebridge

  async SendDebridge(account: string, payableAmount: number, debridgeId: string, receiver: string, tokenAmount: number, decimals: number, chainIdTo: number): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('SendDebridge');
      // Get contract instance
      let tokenContract = new this.web3.eth.Contract(this.whiteDebridgeAbi, this.whiteDebridgeAddress);

      let wei = (new BigNumber(payableAmount)).multipliedBy(1e18).toNumber();
      //let wei = "0x" + new BigNumber(payableAmount).shiftedBy(18).toString(16);
      let stringTokenAmount = "0x" + new BigNumber(tokenAmount).shiftedBy(decimals).toString(16);
      //TODO: check _chainIdTo

      //payable 
      //bytes32 _debridgeId,
      //address _receiver,
      //uint256 _amount,
      //uint256 _chainIdTo
      return tokenContract.methods.send(debridgeId, receiver, stringTokenAmount, chainIdTo)
        .send({ value: wei, from: account })
        .on('transactionHash', function (hash: any) {
          console.info('transactionHash');
          console.info(hash);
        })
        .on('receipt', function (receipt: any) {
          console.info('receipt');
          console.info(receipt);
          resolve(receipt);
        })
        .on('error', function (error: any, receipt: any) {
          console.error(error);
          console.error(receipt);
          reject(error);
        });
    }) as Promise<any>;
  }


  async MintDebridge(account: string, debridgeId: string, receiver: string, tokenAmountWithDecimals: string, nonce: number): Promise<any> {
    return new Promise((resolve, reject) => {
      // Get contract instance
      let tokenContract = new this.web3.eth.Contract(this.whiteDebridgeAbi, this.whiteDebridgeAddress);

      let stringTokenAmount = "0x" + new BigNumber(tokenAmountWithDecimals).toString(16);

      //TODO: check nonce 
      //function mint(
      //  bytes32 _debridgeId,
      //  address _receiver,
      //  uint256 _amount,
      //  uint256 _nonce
      //) 
      return tokenContract.methods.mint(debridgeId, receiver, stringTokenAmount, nonce)
        .send({ from: account })
        .on('transactionHash', function (hash: any) {
          console.info('transactionHash');
          console.info(hash);
        })
        .on('receipt', function (receipt: any) {
          console.info('receipt');
          console.info(receipt);
          resolve(receipt);
        })
        .on('error', function (error: any, receipt: any) {
          console.error(error);
          console.error(receipt);
          reject(error);
        });
    }) as Promise<any>;
  }

  async BurnDebridge(account: string, debridgeId: string, receiver: string, tokenAmount: number, decimals: number): Promise<any> {
    return new Promise((resolve, reject) => {
      // Get contract instance
      let tokenContract = new this.web3.eth.Contract(this.whiteDebridgeAbi, this.whiteDebridgeAddress);

      let stringTokenAmount = "0x" + new BigNumber(tokenAmount).shiftedBy(decimals).toString(16);


      //function burn(
      //  bytes32 _debridgeId,
      //  address _receiver,
      //  uint256 _amount
      //)
      return tokenContract.methods.burn(debridgeId, receiver, stringTokenAmount)
        .send({ from: account })
        .on('transactionHash', function (hash: any) {
          console.info('transactionHash');
          console.info(hash);
        })
        .on('receipt', function (receipt: any) {
          console.info('receipt');
          console.info(receipt);
          resolve(receipt);
        })
        .on('error', function (error: any, receipt: any) {
          console.error(error);
          console.error(receipt);
          reject(error);
        });
    }) as Promise<any>;
  }


  async ClaimDebridge(account: string, debridgeId: string, receiver: string, tokenAmountWithDecimals: string, nonce: number): Promise<any> {
    return new Promise((resolve, reject) => {
      // Get contract instance
      let tokenContract = new this.web3.eth.Contract(this.whiteDebridgeAbi, this.whiteDebridgeAddress);

      let stringTokenAmount = "0x" + new BigNumber(tokenAmountWithDecimals).toString(16);

      //TODO: check nonce

      //function claim(
      //  bytes32 _debridgeId,
      //  address _receiver,
      //  uint256 _amount,
      //  uint256 _nonce
      //)
      return tokenContract.methods.claim(debridgeId, receiver, stringTokenAmount, nonce)
        .send({ from: account })
        .on('transactionHash', function (hash: any) {
          console.info('transactionHash');
          console.info(hash);
        })
        .on('receipt', function (receipt: any) {
          console.info('receipt');
          console.info(receipt);
          resolve(receipt);
        })
        .on('error', function (error: any, receipt: any) {
          console.error(error);
          console.error(receipt);
          reject(error);
        });
    }) as Promise<any>;
  }

  //TODO: may be need to separate bscweb3 and ethweb3
  async GetDebridgeId(chainId: number, tokenAddress: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let contract = new this.web3.eth.Contract(this.whiteDebridgeAbi, this.whiteDebridgeAddress);
      //uint256 _chainId, address _tokenAddress
      contract.methods.getDebridgeId(chainId, tokenAddress).call({}, (error: any, resp: any) => {
        resolve(resp);
      });
    }) as Promise<any>;
  }

  async GetDebridge(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let contract = new this.web3.eth.Contract(this.whiteDebridgeAbi, this.whiteDebridgeAddress);
      //uint256 _chainId, address _tokenAddress
      contract.methods.getDebridge(id).call({}, (error: any, resp: any) => {
        resolve(resp);
      });
    }) as Promise<any>;
  }


  async GetSubmisionId(debridgeId: string, amount: number, receiver: string, nonce: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let contract = new this.web3.eth.Contract(this.whiteDebridgeAbi, this.whiteDebridgeAddress);
      //bytes32 _debridgeId,
      //uint256 _amount,
      //address _receiver,
      //uint256 _nonce
      contract.methods.getSubmisionId(debridgeId, amount, receiver, nonce).call({}, (error: any, resp: any) => {
        resolve(resp);
      });
    }) as Promise<any>;
  }


  async GetSupportedChainIds(debridgeId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let contract = new this.web3.eth.Contract(this.whiteDebridgeAbi, this.whiteDebridgeAddress);
      //bytes32 _debridgeId,
      contract.methods.getSupportedChainIds(debridgeId).call({}, (error: any, resp: any) => {
        resolve(resp);
      });
    }) as Promise<any>;
  }

  //#endregion

}
