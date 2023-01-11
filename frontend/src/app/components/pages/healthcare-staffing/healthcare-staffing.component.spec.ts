import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthcareStaffingComponent } from './healthcare-staffing.component';

describe('HealthcareStaffingComponent', () => {
  let component: HealthcareStaffingComponent;
  let fixture: ComponentFixture<HealthcareStaffingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthcareStaffingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthcareStaffingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
