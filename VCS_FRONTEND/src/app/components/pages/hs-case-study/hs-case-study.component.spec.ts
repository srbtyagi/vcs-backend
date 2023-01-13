import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsCaseStudyComponent } from './hs-case-study.component';

describe('HsCaseStudyComponent', () => {
  let component: HsCaseStudyComponent;
  let fixture: ComponentFixture<HsCaseStudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsCaseStudyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsCaseStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
