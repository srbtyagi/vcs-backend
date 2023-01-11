import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApplicantAdminComponent } from './add-applicant-admin.component';

describe('AddApplicantAdminComponent', () => {
  let component: AddApplicantAdminComponent;
  let fixture: ComponentFixture<AddApplicantAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddApplicantAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddApplicantAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
