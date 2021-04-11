import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { AlertComponent } from './alert.component';
import { DlgAlertComponent } from './dlg-alert.component';

import { AlertService } from './alert.service';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule
    ],
    declarations: [
        AlertComponent,
        DlgAlertComponent
    ],
    exports: [
        AlertComponent,
        DlgAlertComponent
    ],
    entryComponents: [
        DlgAlertComponent
    ],
    providers: [
        AlertService
    ]
})
export class SharedDlgModule {
}
