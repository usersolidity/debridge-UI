import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lobby',
  templateUrl: './app-lobby.component.html',
  styleUrls: ['./app-lobby.component.scss']
})
export class AppLobbyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  alert() {
    alert(123);
  }

}
