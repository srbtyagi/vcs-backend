import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSkillSetComponent } from './admin-skill-set.component';

describe('AdminSkillSetComponent', () => {
  let component: AdminSkillSetComponent;
  let fixture: ComponentFixture<AdminSkillSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSkillSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSkillSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
