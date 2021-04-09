import { NgModule } from "@angular/core"
import { NetworkSymbolPipe } from "./networkSymbol.pipe";
import { ShiftDecimals } from "./shiftDecimals.pipe";
import { ShortAddressPipe } from "./shortAddress.pipe";
import { ShortTxPipe } from "./shortTx.pipe";
import { YesNoPipe } from "./YesNo.pipe";

@NgModule({
  exports: [
    ShortAddressPipe,
    ShortTxPipe,
    YesNoPipe,
    ShiftDecimals,
    NetworkSymbolPipe
  ],
  declarations: [
    ShortAddressPipe,
    ShortTxPipe,
    YesNoPipe,
    ShiftDecimals,
    NetworkSymbolPipe
  ],
  providers: [
  ]
})
export class PipesModule {
}
