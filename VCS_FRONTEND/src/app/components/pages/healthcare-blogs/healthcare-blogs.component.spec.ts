import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthcareBlogsComponent } from './healthcare-blogs.component';

describe('HealthcareBlogsComponent', () => {
  let component: HealthcareBlogsComponent;
  let fixture: ComponentFixture<HealthcareBlogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthcareBlogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthcareBlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
