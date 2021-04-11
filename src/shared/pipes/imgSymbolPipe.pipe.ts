import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "imgSymbol"
})
export class ImgSymbolPipe implements PipeTransform {
  transform(symbol: string): string {
    if (symbol.includes('BNB'))
      return "../../assets/svg/bsc.svg";
    if (symbol.includes('BSC'))
      return "../../assets/svg/bsc.svg";
    if (symbol.includes('ETH'))
      return "../../assets/svg/eth_black.svg";
    return "";
  }
}
