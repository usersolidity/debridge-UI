import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgSelectCoinComponent } from './dlg-select-coin.component';

describe('DlgSelectCoinComponent', () => {
  let component: DlgSelectCoinComponent;
  let fixture: ComponentFixture<DlgSelectCoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlgSelectCoinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgSelectCoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
