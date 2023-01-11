import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ITServiceComponent } from './it-service.component';

describe('ITServiceComponent', () => {
  let component: ITServiceComponent;
  let fixture: ComponentFixture<ITServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ITServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ITServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
