import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollInvoiceComponent } from './payroll-invoice.component';

describe('PayrollInvoiceComponent', () => {
  let component: PayrollInvoiceComponent;
  let fixture: ComponentFixture<PayrollInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
