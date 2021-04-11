// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  eth: {
    whiteDebridgeAddress:"0xe964d94c7E84A62846F749191c776319fb0BdfdA"
  },
  bsc: {
    whiteDebridgeAddress:"0x36aAD5C9a923AFf753e8cbf146C8D6E51359b1b5"
  },
  remoteServiceBaseUrl: "https://testapi.debridge.finance",
  // # 10+ nodes balanced, US/EU
  APP_NODE_1: "https://bsc-dataseed1.ninicoin.io",

  // # 10+ nodes balanced, US/EU
  APP_NODE_2: "https://bsc-dataseed1.defibit.io",

  // # 10+ nodes balanced in each region, global
  APP_NODE_3: "https://bsc-dataseed.binance.org",

  APP_CHAIN_ID: "56",
  APP_CHAIN_KOVAN_ID: "42"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
