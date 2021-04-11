import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
    @Input() icon: string = '';
    @Input() title: string = '';
    @Input() message: string = '';
    @Input() innerHTML: string = '';
    @Input() buttonOkLabel: string = '';

    @Output() close: EventEmitter<any> = new EventEmitter();

    constructor(
    ) {
    }

    onContinue() {
        this.close.emit();
    }
}
