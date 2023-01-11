import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingHiringComponent } from './onboarding-hiring.component';

describe('OnboardingHiringComponent', () => {
  let component: OnboardingHiringComponent;
  let fixture: ComponentFixture<OnboardingHiringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardingHiringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingHiringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
