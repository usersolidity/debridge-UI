import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dlg-alert',
    templateUrl: './dlg-alert.component.html',
    styleUrls: ['./dlg-alert.component.scss'],
})
export class DlgAlertComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<DlgAlertComponent>,

        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {
    }

    onClose() {
        this.dialogRef.close();
    }

}
