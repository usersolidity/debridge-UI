import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTransferComponent } from './app-transfer.component';

describe('AppTransferComponent', () => {
  let component: AppTransferComponent;
  let fixture: ComponentFixture<AppTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
