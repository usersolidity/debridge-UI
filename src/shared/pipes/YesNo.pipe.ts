import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "YesNo"
})
export class YesNoPipe implements PipeTransform {
    transform(value: any): string {
        if (value) {
            return "Yes";
        }
        return "No";
    }
}