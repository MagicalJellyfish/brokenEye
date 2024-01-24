import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementEditComponent } from './element-edit.component';

describe('ElementEditComponent', () => {
  let component: ElementEditComponent;
  let fixture: ComponentFixture<ElementEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElementEditComponent]
    });
    fixture = TestBed.createComponent(ElementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
