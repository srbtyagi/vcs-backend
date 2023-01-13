import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillChecklistComponent } from './skill-checklist.component';

describe('SkillChecklistComponent', () => {
  let component: SkillChecklistComponent;
  let fixture: ComponentFixture<SkillChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
