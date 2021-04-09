import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import coins from './coins.data';
  
@Component({
    selector: 'dlg-select-coin',
    templateUrl: './dlg-select-coin.component.html',
    styleUrls: ['./dlg-select-coin.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DlgSelectCoinComponent implements OnInit {

    coins = coins;

    constructor(
        public dialogRef: MatDialogRef<DlgSelectCoinComponent>,
    ) { }

    ngOnInit(): void {
    }

    select(coin: any) {
        this.dialogRef.close(coin);
    }
}
