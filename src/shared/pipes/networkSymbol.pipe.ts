import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "networkSymbol"
})
export class NetworkSymbolPipe implements PipeTransform {
  transform(value: number): string {
    if (value == 1)
      return "ETH"
    else if (value == 42)
      return "Kovan"
    else if (value == 56)
      return "BSC"

    return value.toString();
  }
}
