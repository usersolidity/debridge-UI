import {
    Component,
    OnInit,
    HostBinding,
    HostListener
} from '@angular/core';

import GB_flag from '../../assets/svg/GB_flag.svg';
import RU_flag from '../../assets/svg/RU_flag.svg';
import eth from '../../assets/svg/eth.svg';

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
    isMenu = false;
    @HostBinding('attr.is-menu') get _isMenu() {
        if (this.isMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return this.isMenu;
    };

    @HostListener('wheel', ['$event'])
    onScroll($event: MouseEvent) {
        if (this.isMenu) {
                $event.preventDefault();
            $event.stopPropagation();
        }
    }

    langs = [
        //{
        //    img: RU_flag,
        //    value: 'ru',
        //    label: 'RU'
        //},
        {
            img: GB_flag,
            value: 'en',
            label: 'EN'
        }
    ]
    lang = this.langs[0];

    currencies = [
        {
            img: eth,
            value: 'eth',
            label: 'ETH'
        },
        {
            img: eth,
            value: 'btc',
            label: 'BTC'
        }
    ]

    currency = this.currencies[0];

    constructor() { }

    ngOnInit(): void {
    }

    toggleMenu() {
        this.isMenu = !this.isMenu;
    }
}
