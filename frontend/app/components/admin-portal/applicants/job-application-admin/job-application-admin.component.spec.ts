import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplicationAdminComponent } from './job-application-admin.component';

describe('JobApplicationAdminComponent', () => {
  let component: JobApplicationAdminComponent;
  let fixture: ComponentFixture<JobApplicationAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobApplicationAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobApplicationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
