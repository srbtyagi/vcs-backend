import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyjobsDashboardComponent } from './myjobs-dashboard.component';

describe('MyjobsDashboardComponent', () => {
  let component: MyjobsDashboardComponent;
  let fixture: ComponentFixture<MyjobsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyjobsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyjobsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
