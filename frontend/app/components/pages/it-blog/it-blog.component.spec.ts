import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ITBlogComponent } from './it-blog.component';

describe('ITBlogComponent', () => {
  let component: ITBlogComponent;
  let fixture: ComponentFixture<ITBlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ITBlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ITBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
