import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { throwError, merge } from 'rxjs';
import { filter, switchMap  } from 'rxjs/operators';

import { DlgSelectCoinComponent } from '../dlg-select-coin';

@Component({
    selector: 'app-currency-details',
    templateUrl: './app-currency-details.component.html',
    styleUrls: ['./app-currency-details.component.scss']
})
export class AppCurrencyDetailsComponent implements OnInit {

    constructor(
        private _dialog: MatDialog,
    ) { }

    ngOnInit(): void {
    }

    async selectCoin() {
        const dialogRef = this._dialog.open(DlgSelectCoinComponent, {
            backdropClass: 'dlg-select-coin-backdrop',
            panelClass: ['dlg-select-coin-panel']
        });
        
        const source = dialogRef.afterClosed();
        const success$ = source
            .pipe(filter<boolean>((val) => val));
        const error$ = source
            .pipe(filter((val) => !val))
            .pipe(switchMap((error) => throwError(`${ error }`)));

        let res;
        try {
            // It's a selected coin
            res = await merge(success$, error$).toPromise();
        } catch (err) {
            return;
        }
    }

}
