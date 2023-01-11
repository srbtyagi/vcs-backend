import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ITCaseStudyComponent } from './it-case-study.component';

describe('ITCaseStudyComponent', () => {
  let component: ITCaseStudyComponent;
  let fixture: ComponentFixture<ITCaseStudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ITCaseStudyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ITCaseStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
