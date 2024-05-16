import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementNestedTabComponent } from './element-nested-tab.component';

describe('ElementNestedTabComponent', () => {
  let component: ElementNestedTabComponent;
  let fixture: ComponentFixture<ElementNestedTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElementNestedTabComponent],
    });
    fixture = TestBed.createComponent(ElementNestedTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
