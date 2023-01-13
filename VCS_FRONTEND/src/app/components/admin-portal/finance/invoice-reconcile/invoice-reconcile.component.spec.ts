import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceReconcileComponent } from './invoice-reconcile.component';

describe('InvoiceReconcileComponent', () => {
  let component: InvoiceReconcileComponent;
  let fixture: ComponentFixture<InvoiceReconcileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceReconcileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceReconcileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
