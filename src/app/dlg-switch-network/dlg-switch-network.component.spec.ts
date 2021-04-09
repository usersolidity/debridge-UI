import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgSwitchNetworkComponent } from './dlg-switch-network.component';

describe('DlgSwitchNetworkComponent', () => {
  let component: DlgSwitchNetworkComponent;
  let fixture: ComponentFixture<DlgSwitchNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlgSwitchNetworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgSwitchNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
