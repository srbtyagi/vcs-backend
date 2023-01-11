import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseCandidateComponent } from './browse-candidate.component';

describe('BrowseCandidateComponent', () => {
  let component: BrowseCandidateComponent;
  let fixture: ComponentFixture<BrowseCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
