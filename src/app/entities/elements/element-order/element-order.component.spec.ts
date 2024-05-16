import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementOrderComponent } from './element-order.component';

describe('ElementOrderComponent', () => {
  let component: ElementOrderComponent;
  let fixture: ComponentFixture<ElementOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElementOrderComponent],
    });
    fixture = TestBed.createComponent(ElementOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
