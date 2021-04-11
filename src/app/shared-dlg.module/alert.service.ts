import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';

import { merge, throwError as _throw } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';

import { DlgAlertComponent } from './dlg-alert.component';

@Injectable()
export class AlertService {
    constructor(
        private _dialog: MatDialog,
    ) {
    }

    show(message?: MatDialogConfig<any> | string, icon: string = ''): Promise<any> {
        if (typeof message === 'string') {
            message = {
                data: {
                    icon,
                    message
                }
            };
        }

        const dialogRef = this._dialog.open(DlgAlertComponent, {
            backdropClass: 'dlg-custom-backdrop',
            panelClass: ['dlg-custom-panel'],
            scrollStrategy: new NoopScrollStrategy(),
            ...message
        });

        return dialogRef.afterClosed().toPromise();
    }
}
