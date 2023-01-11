import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentAssignmentComponent } from './current-assignment.component';

describe('CurrentAssignmentComponent', () => {
  let component: CurrentAssignmentComponent;
  let fixture: ComponentFixture<CurrentAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
