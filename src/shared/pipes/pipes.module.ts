import { NgModule } from "@angular/core"
import { ImgSymbolPipe } from "./imgSymbolPipe.pipe";
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
    NetworkSymbolPipe,
    ImgSymbolPipe
  ],
  declarations: [
    ShortAddressPipe,
    ShortTxPipe,
    YesNoPipe,
    ShiftDecimals,
    NetworkSymbolPipe,
    ImgSymbolPipe
  ],
  providers: [
  ]
})
export class PipesModule {
}
