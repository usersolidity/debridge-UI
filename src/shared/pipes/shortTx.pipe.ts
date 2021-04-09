import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "shortTx"
})
export class ShortTxPipe implements PipeTransform {
    transform(value: string): string {
        if (value && value.length > 20) {
            return value.substring(0, 8) + "..." + value.substring(value.length - 8, value.length);
        }
        return value;
    }
}
