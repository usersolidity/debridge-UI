import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCurrencyDetailsComponent } from './app-currency-details.component';

describe('AppCurrencyDetailsComponent', () => {
  let component: AppCurrencyDetailsComponent;
  let fixture: ComponentFixture<AppCurrencyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppCurrencyDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCurrencyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
