import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PairEventDTO } from '../../service-proxies/service-proxies';
import { EventBus } from '../../shared/event-bus';

import coins from './coins.data';

@Component({
  selector: 'dlg-select-coin',
  templateUrl: './dlg-select-coin.component.html',
  styleUrls: ['./dlg-select-coin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DlgSelectCoinComponent implements OnInit {

  @Input() Pairs: Array<PairEventDTO>;

  coins = coins;

  constructor(
    public dialogRef: MatDialogRef<DlgSelectCoinComponent>,
    private eventBus: EventBus
  ) { }

  ngOnInit(): void {
  }

  select(coin: any) {
    this.eventBus.fromPairChanged.emit(coin);
    this.dialogRef.close(coin);
  }
}
