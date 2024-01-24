import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementDialogTabMultipleComponent } from './element-dialog-tab-multiple.component';

describe('ElementDialogTabMultipleComponent', () => {
  let component: ElementDialogTabMultipleComponent;
  let fixture: ComponentFixture<ElementDialogTabMultipleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElementDialogTabMultipleComponent]
    });
    fixture = TestBed.createComponent(ElementDialogTabMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
