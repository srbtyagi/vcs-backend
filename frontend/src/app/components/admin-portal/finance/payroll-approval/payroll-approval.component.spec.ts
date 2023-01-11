import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollApprovalComponent } from './payroll-approval.component';

describe('PayrollApprovalComponent', () => {
  let component: PayrollApprovalComponent;
  let fixture: ComponentFixture<PayrollApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayrollApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
