import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';

const mock = [{
    tx: '0x39...fddc',
    token: '0xdd...d03e DIS',
    amount: 6,
    confirmed: 'Yes',
    signed: 'Yes',
    action: 'Recieved'
}, {
    tx: '0x39...fddc',
    token: '0xdd...d03e DIS',
    amount: 6,
    confirmed: 'Yes',
    signed: 'Yes',
    action: 'Recieve'
}]

export class TransferRecordsSource implements DataSource<any> {
    private _dataSubject = new BehaviorSubject<any[]>(mock);

    constructor(
    ) {
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this._dataSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this._dataSubject.complete();
    }

}
