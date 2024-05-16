import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementDialogTabSingleComponent } from './element-dialog-tab-single.component';

describe('ElementDialogTabSingleComponent', () => {
  let component: ElementDialogTabSingleComponent;
  let fixture: ComponentFixture<ElementDialogTabSingleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElementDialogTabSingleComponent],
    });
    fixture = TestBed.createComponent(ElementDialogTabSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
