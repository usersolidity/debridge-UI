import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserSessionProvider } from '../../shared/user-session-provider';

@Component({
  selector: 'dlg-wallet',
  templateUrl: './dlg-wallet.component.html',
  styleUrls: ['./dlg-wallet.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DlgWalletComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DlgWalletComponent>,
    private userSessionProvider: UserSessionProvider
  ) { }

  account: string;

  ngOnInit(): void {
    this.account = this.userSessionProvider.username;
  }

}
