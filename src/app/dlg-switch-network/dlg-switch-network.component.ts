import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserSessionProvider } from '../../shared/user-session-provider';
import { Web3Service } from '../../shared/web3-service';
import { AlertService } from '../shared-dlg.module';

@Component({
  selector: 'dlg-switch-network',
  templateUrl: './dlg-switch-network.component.html',
  styleUrls: ['./dlg-switch-network.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DlgSwitchNetworkComponent implements OnInit {

  constructor(public web3Service: Web3Service,
    private userSessionProvider: UserSessionProvider,
    private _alertSrv: AlertService) { }

  ngOnInit(): void {
  }


  //TODO: move to base class
  async selectETH(): Promise<boolean> {
    // this.showInfoModal("Change network in MetaMask!");

    const nodes = [environment.APP_NODE_1, environment.APP_NODE_2, environment.APP_NODE_3];

    const provider = window.ethereum
    if (provider) {
      if (this.userSessionProvider.getIsBSC) {
        this._alertSrv.show("Select Kovan Network in your wallet.", 'error')
        return false;
        //const chainId = parseInt(environment.APP_CHAIN_KOVAN_ID, 10)
        //try {
        //  // @ts-ignore
        //  await provider.request({
        //    method: 'wallet_addEthereumChain',
        //    params: [ 
        //      {
        //        chainId: `0x${chainId.toString(16)}`,
        //        chainName: 'Kovan Test Network',
        //        nativeCurrency: {
        //          name: 'ETH',
        //          symbol: 'ETH',
        //          decimals: 18,
        //        },
        //        rpcUrls: ["https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
        //        blockExplorerUrls: ['https://kovan.etherscan.io/'],
        //      },
        //    ],
        //  })
        //  return true
        //} catch (error) {
        //  console.error(error)
        //  return false
        //}
      }
      else {
        const chainId = parseInt(environment.APP_CHAIN_ID, 10)
        try {
          // @ts-ignore
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: 'Binance Smart Chain Mainnet',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'bnb',
                  decimals: 18,
                },
                rpcUrls: nodes,
                blockExplorerUrls: ['https://bscscan.com/'],
              },
            ],
          })
          return true
        } catch (error) {
          console.error(error)
          return false
        }
      }
    } else {
      if (this.userSessionProvider.getIsBSC) {
        this.userSessionProvider.setETHNetwork();
      }
      else {
        this.userSessionProvider.setBSCNetwork();
      }
      location.reload();
      console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
      return false
    }
  }



  //TODO: move to base class
  async selectBSC(): Promise<boolean> {
    // this.showInfoModal("Change network in MetaMask!");

    const nodes = [environment.APP_NODE_1, environment.APP_NODE_2, environment.APP_NODE_3];

    const provider = window.ethereum
    if (provider) {
      const chainId = parseInt(environment.APP_CHAIN_ID, 10)
      try {
        // @ts-ignore
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: 'Binance Smart Chain Mainnet',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'bnb',
                decimals: 18,
              },
              rpcUrls: nodes,
              blockExplorerUrls: ['https://bscscan.com/'],
            },
          ],
        })
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    }

    else {
      if (this.userSessionProvider.getIsBSC) {
        this.userSessionProvider.setETHNetwork();
      }
      else {
        this.userSessionProvider.setBSCNetwork();
      }
      location.reload();
      console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
      return false
    }
  }
}
