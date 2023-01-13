import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingAndHiringComponent } from './onboarding-and-hiring.component';

describe('OnboardingAndHiringComponent', () => {
  let component: OnboardingAndHiringComponent;
  let fixture: ComponentFixture<OnboardingAndHiringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingAndHiringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingAndHiringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
