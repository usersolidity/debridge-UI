import { Pipe, PipeTransform } from "@angular/core";
import { BigNumber } from "bignumber.js";
/**
 * Pipe для преобразования дат.
 * Используется ка workaround вместо date для Edge и IE (см. https://github.com/angular/angular/issues/9524)
 * !!! Формат отличается от обычного date: например, "DD.MM.YYYY" вместо "dd.MM.yyyy" (подробнее см. форматы библиотеки moment)
 */
@Pipe({
    name: "shiftDecimals"
})
export class ShiftDecimals implements PipeTransform {
    transform(value: string, shiftedBy: number): number {
        console.log(`ShiftDecimals ${value} shiftedBy ${shiftedBy}`);
        if (value) {
            console.log((new BigNumber(value).shiftedBy(shiftedBy)).toNumber());
            return (new BigNumber(value).shiftedBy(shiftedBy)).toNumber();
        }
        return 0;
    }
}