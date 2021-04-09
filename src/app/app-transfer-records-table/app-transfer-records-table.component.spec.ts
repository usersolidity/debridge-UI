import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTransferRecordsTableComponent } from './app-transfer-records-table.component';

describe('AppTransferRecordsTableComponent', () => {
  let component: AppTransferRecordsTableComponent;
  let fixture: ComponentFixture<AppTransferRecordsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppTransferRecordsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTransferRecordsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
