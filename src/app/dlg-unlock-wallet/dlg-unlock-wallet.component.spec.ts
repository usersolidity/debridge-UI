import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockWalletComponent } from './dlg-unlock-wallet.component';

describe('UnlockWalletComponent', () => {
  let component: UnlockWalletComponent;
  let fixture: ComponentFixture<UnlockWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnlockWalletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
