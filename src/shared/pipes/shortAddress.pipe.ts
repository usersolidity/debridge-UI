import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "shortAddress"
})
export class ShortAddressPipe implements PipeTransform {
    transform(value: string): string {
        if (value && value.length > 20) {
            return value.substring(0, 4) + "..." + value.substring(value.length - 4, value.length);
        }
        return value;
    }
}