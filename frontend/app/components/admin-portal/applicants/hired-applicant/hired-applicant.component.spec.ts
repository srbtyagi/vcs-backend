import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HiredApplicantComponent } from './hired-applicant.component';

describe('HiredApplicantComponent', () => {
  let component: HiredApplicantComponent;
  let fixture: ComponentFixture<HiredApplicantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiredApplicantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HiredApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
