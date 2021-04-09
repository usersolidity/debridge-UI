import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLobbyComponent } from './app-lobby.component';

describe('AppLobbyComponent', () => {
  let component: AppLobbyComponent;
  let fixture: ComponentFixture<AppLobbyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppLobbyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
