import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyJobGuestComponent } from './apply-job-guest.component';

describe('ApplyJobGuestComponent', () => {
  let component: ApplyJobGuestComponent;
  let fixture: ComponentFixture<ApplyJobGuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyJobGuestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyJobGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
