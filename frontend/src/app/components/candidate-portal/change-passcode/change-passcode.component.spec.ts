import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasscodeComponent } from './change-passcode.component';

describe('ChangePasscodeComponent', () => {
  let component: ChangePasscodeComponent;
  let fixture: ComponentFixture<ChangePasscodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasscodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasscodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
